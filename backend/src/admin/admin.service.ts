import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, Page, AudioFile } from '../entities';
import { CreateBookDto } from './dto/create-book.dto';
import * as fs from 'fs';
import * as path from 'path';
import { fromPath } from 'pdf2pic';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
    @InjectRepository(AudioFile)
    private audioRepository: Repository<AudioFile>,
  ) {}

  async uploadBook(
    file: Express.Multer.File,
    createBookDto: CreateBookDto,
  ): Promise<{ success: boolean; book_id: number; pages_imported: number }> {
    // Save PDF temporarily
    const tempDir = path.join(process.cwd(), 'temp');
    const tempPdfPath = path.join(tempDir, `${Date.now()}-${file.originalname}`);
    
    try {
      // Ensure temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Write PDF to temp file
      fs.writeFileSync(tempPdfPath, file.buffer);

      // Get page count
      const pageCount = await this.getPageCount(tempPdfPath);

      // Create book record
      const book = this.booksRepository.create({
        title: createBookDto.title,
        category: createBookDto.category,
        hasListening: createBookDto.hasListening,
        totalPages: pageCount,
      });
      await this.booksRepository.save(book);

      // Convert PDF to images and store
      await this.processPdfPages(tempPdfPath, book.id, pageCount);

      // Clean up temp file
      fs.unlinkSync(tempPdfPath);

      return {
        success: true,
        book_id: book.id,
        pages_imported: pageCount,
      };
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
      throw new BadRequestException(`Failed to process PDF: ${error.message}`);
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
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.numpages;
  }

  private async processPdfPages(
    pdfPath: string,
    bookId: number,
    pageCount: number,
  ): Promise<void> {
    const options = {
      density: 150, // DPI
      saveFilename: `book-${bookId}`,
      savePath: path.join(process.cwd(), 'temp'),
      format: 'jpeg',
      width: 1200,
      height: 1600,
    };

    const convert = fromPath(pdfPath, options);

    // Process pages in batches to avoid memory issues
    const batchSize = 10;
    for (let i = 1; i <= pageCount; i += batchSize) {
      const batch = [];
      const endPage = Math.min(i + batchSize - 1, pageCount);

      for (let pageNum = i; pageNum <= endPage; pageNum++) {
        batch.push(this.convertAndStorePage(convert, bookId, pageNum));
      }

      await Promise.all(batch);
    }
  }

  private async convertAndStorePage(
    convert: any,
    bookId: number,
    pageNumber: number,
  ): Promise<void> {
    try {
      const result = await convert(pageNumber, { responseType: 'buffer' });
      
      const page = this.pagesRepository.create({
        bookId,
        pageNumber,
        imageData: result.buffer,
        imageFormat: 'jpeg',
      });

      await this.pagesRepository.save(page);

      // Clean up temp image file if it exists
      if (result.path && fs.existsSync(result.path)) {
        fs.unlinkSync(result.path);
      }
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
}
