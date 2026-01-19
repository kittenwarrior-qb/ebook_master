/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, Page, AudioFile } from '../entities';
import { CreateBookDto } from './dto/create-book.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as fs from 'fs';
import * as path from 'path';
import { pdf } from 'pdf-to-img';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
    @InjectRepository(AudioFile)
    private audioRepository: Repository<AudioFile>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadBook(
    file: Express.Multer.File,
    createBookDto: CreateBookDto,
  ): Promise<{
    success: boolean;
    book_id: number;
    pages_imported: number;
    status: string;
  }> {
    // Save PDF temporarily
    const tempDir = path.join(process.cwd(), 'temp');
    const tempPdfPath = path.join(
      tempDir,
      `${Date.now()}-${file.originalname}`,
    );

    try {
      // Ensure temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Write PDF to temp file
      fs.writeFileSync(tempPdfPath, file.buffer);

      // Get page count
      const pageCount = await this.getPageCount(tempPdfPath);

      // Create book record with pending status
      const book = this.booksRepository.create({
        title: createBookDto.title,
        category: createBookDto.category,
        hasListening: createBookDto.hasListening,
        totalPages: pageCount,
        processingStatus: 'pending',
        processedPages: 0,
        processingMessage: 'Đang chuẩn bị xử lý PDF...',
      });
      await this.booksRepository.save(book);

      // Process PDF in background (don't await)
      this.processPdfInBackground(tempPdfPath, book.id, pageCount).catch(
        (error) => {
          console.error('Background processing error:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          void this.updateBookStatus(
            book.id,
            'failed',
            0,
            `Lỗi: ${errorMessage}`,
          );
        },
      );

      return {
        success: true,
        book_id: book.id,
        pages_imported: pageCount,
        status: 'processing',
      };
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to process PDF: ${errorMessage}`);
    }
  }

  async uploadAudio(
    file: Express.Multer.File,
    bookId: number,
  ): Promise<{ success: boolean; audio_id: number }> {
    // Check if book exists
    const book = await this.booksRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    if (!book.hasListening) {
      throw new BadRequestException(
        `Book with ID ${bookId} is not marked as having listening content`,
      );
    }

    // Check if audio already exists
    const existingAudio = await this.audioRepository.findOne({
      where: { bookId },
    });

    if (existingAudio) {
      // Update existing audio
      existingAudio.audioData = file.buffer;
      existingAudio.audioFormat = this.getAudioFormat(file.mimetype);
      await this.audioRepository.save(existingAudio);

      return {
        success: true,
        audio_id: existingAudio.id,
      };
    } else {
      // Create new audio
      const audio = this.audioRepository.create({
        bookId,
        audioData: file.buffer,
        audioFormat: this.getAudioFormat(file.mimetype),
      });
      await this.audioRepository.save(audio);

      return {
        success: true,
        audio_id: audio.id,
      };
    }
  }

  private async getPageCount(pdfPath: string): Promise<number> {
    const document = await pdf(pdfPath, { scale: 2.0 });
    let count = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _page of document) {
      count++;
    }
    return count;
  }

  private async processPdfPages(
    pdfPath: string,
    bookId: number,
    pageCount: number,
  ): Promise<void> {
    const document = await pdf(pdfPath, { scale: 2.0 });

    let pageNumber = 0;
    const batch: Promise<void>[] = [];
    const batchSize = 10;

    for await (const page of document) {
      pageNumber++;
      batch.push(this.convertAndStorePage(page, bookId, pageNumber));

      // Process in batches
      if (batch.length >= batchSize || pageNumber === pageCount) {
        await Promise.all(batch);
        batch.length = 0;

        // Update progress
        await this.updateBookStatus(
          bookId,
          'processing',
          pageNumber,
          `Đang xử lý trang ${pageNumber}/${pageCount}...`,
        );
      }
    }
  }

  private async convertAndStorePage(
    pageBuffer: Buffer,
    bookId: number,
    pageNumber: number,
  ): Promise<void> {
    try {
      // Upload to Cloudinary
      const folder = `toeic-master/books/${bookId}`;
      const publicId = `page-${pageNumber}`;
      const { url, publicId: cloudinaryPublicId } =
        await this.cloudinaryService.uploadImage(pageBuffer, folder, publicId);

      // Save URL to database
      const pageEntity = this.pagesRepository.create({
        bookId,
        pageNumber,
        imageUrl: url,
        cloudinaryPublicId,
        imageFormat: 'png',
      });

      await this.pagesRepository.save(pageEntity);
    } catch (error) {
      console.error(`Error processing page ${pageNumber}:`, error);
      throw error;
    }
  }

  private getAudioFormat(mimetype: string): string {
    if (mimetype.includes('mp3') || mimetype.includes('mpeg')) {
      return 'mp3';
    } else if (mimetype.includes('wav')) {
      return 'wav';
    } else if (mimetype.includes('ogg')) {
      return 'ogg';
    }
    return 'mp3'; // default
  }

  async getBookStatus(bookId: number): Promise<{
    book_id: number;
    status: string;
    processed_pages: number;
    total_pages: number;
    message: string;
    progress_percentage: number;
  }> {
    const book = await this.booksRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    const progressPercentage =
      book.totalPages > 0
        ? Math.round((book.processedPages / book.totalPages) * 100)
        : 0;

    return {
      book_id: book.id,
      status: book.processingStatus,
      processed_pages: book.processedPages,
      total_pages: book.totalPages,
      message: book.processingMessage || '',
      progress_percentage: progressPercentage,
    };
  }

  private async processPdfInBackground(
    pdfPath: string,
    bookId: number,
    pageCount: number,
  ): Promise<void> {
    try {
      await this.updateBookStatus(
        bookId,
        'processing',
        0,
        'Đang bắt đầu chuyển đổi PDF...',
      );

      await this.processPdfPages(pdfPath, bookId, pageCount);

      // Clean up temp file
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }

      await this.updateBookStatus(
        bookId,
        'completed',
        pageCount,
        'Hoàn tất xử lý PDF!',
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      await this.updateBookStatus(bookId, 'failed', 0, `Lỗi: ${errorMessage}`);
      throw error;
    }
  }

  private async updateBookStatus(
    bookId: number,
    status: string,
    processedPages: number,
    message: string,
  ): Promise<void> {
    await this.booksRepository.update(bookId, {
      processingStatus: status,
      processedPages,
      processingMessage: message,
    });
  }

  async getAllBooks(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    books: Book[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [books, total] = await this.booksRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      books,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBookDetails(bookId: number): Promise<{
    book: Book;
    pages: Page[];
  }> {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    const pages = await this.pagesRepository.find({
      where: { bookId },
      order: { pageNumber: 'ASC' },
    });

    return { book, pages };
  }

  async updateBook(
    bookId: number,
    updateData: {
      title?: string;
      category?: string;
      hasListening?: boolean;
      thumbnailUrl?: string;
    },
  ): Promise<{ success: boolean; book: Book }> {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    await this.booksRepository.update(bookId, updateData);

    const updatedBook = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    return { success: true, book: updatedBook! };
  }

  async deleteBook(bookId: number): Promise<{ success: boolean }> {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    // Delete all pages from Cloudinary
    const pages = await this.pagesRepository.find({ where: { bookId } });
    for (const page of pages) {
      if (page.cloudinaryPublicId) {
        await this.cloudinaryService.deleteImage(page.cloudinaryPublicId);
      }
    }

    // Delete thumbnail from Cloudinary if exists
    if (book.thumbnailUrl) {
      const publicId = this.extractCloudinaryPublicId(book.thumbnailUrl);
      if (publicId) {
        await this.cloudinaryService.deleteImage(publicId);
      }
    }

    // Delete pages from database
    await this.pagesRepository.delete({ bookId });

    // Delete audio if exists
    await this.audioRepository.delete({ bookId });

    // Delete book
    await this.booksRepository.delete(bookId);

    return { success: true };
  }

  async uploadThumbnail(
    bookId: number,
    file: Express.Multer.File,
  ): Promise<{ success: boolean; thumbnailUrl: string }> {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    // Delete old thumbnail if exists
    if (book.thumbnailUrl) {
      const publicId = this.extractCloudinaryPublicId(book.thumbnailUrl);
      if (publicId) {
        await this.cloudinaryService.deleteImage(publicId);
      }
    }

    // Upload new thumbnail
    const folder = `toeic-master/books/${bookId}`;
    const publicId = `thumbnail`;
    const { url } = await this.cloudinaryService.uploadImage(
      file.buffer,
      folder,
      publicId,
    );

    // Update book
    await this.booksRepository.update(bookId, { thumbnailUrl: url });

    return { success: true, thumbnailUrl: url };
  }

  async setPageAsThumbnail(
    bookId: number,
    pageNumber: number,
  ): Promise<{ success: boolean; thumbnailUrl: string }> {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    const page = await this.pagesRepository.findOne({
      where: { bookId, pageNumber },
    });

    if (!page) {
      throw new BadRequestException(
        `Page ${pageNumber} not found for book ${bookId}`,
      );
    }

    // Update book thumbnail to use page image
    await this.booksRepository.update(bookId, { thumbnailUrl: page.imageUrl });

    return { success: true, thumbnailUrl: page.imageUrl };
  }

  async replacePage(
    pageId: number,
    file: Express.Multer.File,
  ): Promise<{ success: boolean; imageUrl: string }> {
    const page = await this.pagesRepository.findOne({
      where: { id: pageId },
    });

    if (!page) {
      throw new BadRequestException(`Page with ID ${pageId} not found`);
    }

    // Delete old image from Cloudinary
    if (page.cloudinaryPublicId) {
      await this.cloudinaryService.deleteImage(page.cloudinaryPublicId);
    }

    // Upload new image
    const folder = `toeic-master/books/${page.bookId}`;
    const publicId = `page-${page.pageNumber}`;
    const { url, publicId: cloudinaryPublicId } =
      await this.cloudinaryService.uploadImage(file.buffer, folder, publicId);

    // Update page
    await this.pagesRepository.update(pageId, {
      imageUrl: url,
      cloudinaryPublicId,
    });

    return { success: true, imageUrl: url };
  }

  private extractCloudinaryPublicId(url: string): string | null {
    const match = url.match(/\/([^/]+)\.(jpg|jpeg|png|gif)$/);
    return match ? match[1] : null;
  }

  async replacePageFromUrl(
    pageId: number,
    imageUrl: string,
  ): Promise<{ success: boolean; imageUrl: string }> {
    const page = await this.pagesRepository.findOne({
      where: { id: pageId },
    });

    if (!page) {
      throw new BadRequestException(`Page with ID ${pageId} not found`);
    }

    // Download image from URL
    const imageBuffer = await this.downloadImageFromUrl(imageUrl);

    // Delete old image from Cloudinary
    if (page.cloudinaryPublicId) {
      await this.cloudinaryService.deleteImage(page.cloudinaryPublicId);
    }

    // Upload new image
    const folder = `toeic-master/books/${page.bookId}`;
    const publicId = `page-${page.pageNumber}`;
    const { url, publicId: cloudinaryPublicId } =
      await this.cloudinaryService.uploadImage(imageBuffer, folder, publicId);

    // Update page
    await this.pagesRepository.update(pageId, {
      imageUrl: url,
      cloudinaryPublicId,
    });

    return { success: true, imageUrl: url };
  }

  async uploadThumbnailFromUrl(
    bookId: number,
    imageUrl: string,
  ): Promise<{ success: boolean; thumbnailUrl: string }> {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    // Download image from URL
    const imageBuffer = await this.downloadImageFromUrl(imageUrl);

    // Delete old thumbnail if exists
    if (book.thumbnailUrl) {
      const publicId = this.extractCloudinaryPublicId(book.thumbnailUrl);
      if (publicId) {
        await this.cloudinaryService.deleteImage(publicId);
      }
    }

    // Upload new thumbnail
    const folder = `toeic-master/books/${bookId}`;
    const publicId = `thumbnail`;
    const { url } = await this.cloudinaryService.uploadImage(
      imageBuffer,
      folder,
      publicId,
    );

    // Update book
    await this.booksRepository.update(bookId, { thumbnailUrl: url });

    return { success: true, thumbnailUrl: url };
  }

  private async downloadImageFromUrl(url: string): Promise<Buffer> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new BadRequestException(
          `Failed to download image: ${response.statusText}`,
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to download image from URL: ${errorMessage}`,
      );
    }
  }
}
