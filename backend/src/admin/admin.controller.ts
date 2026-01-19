import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  PdfFileValidationPipe,
  AudioFileValidationPipe,
  ImageFileValidationPipe,
} from './pipes/file-validation.pipe';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('upload-book')
  @ApiOperation({
    summary: 'Upload a new book PDF',
    description: 'Upload a PDF file and create a new book with metadata',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pdf: {
          type: 'string',
          format: 'binary',
          description: 'PDF file to upload',
        },
        title: { type: 'string', example: 'Hackers TOEIC Listening' },
        category: { type: 'string', enum: ['book', 'test'], example: 'book' },
        hasListening: {
          type: 'string',
          enum: ['true', 'false', '1', '0'],
          example: 'true',
        },
      },
      required: ['pdf', 'title', 'category', 'hasListening'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Book uploaded successfully',
    schema: { example: { success: true, book_id: 1, pages_imported: 120 } },
  })
  @ApiResponse({ status: 400, description: 'Invalid file or parameters' })
  @UseInterceptors(FileInterceptor('pdf'))
  async uploadBook(
    @UploadedFile(PdfFileValidationPipe) pdf: Express.Multer.File,
    @Body('title') title: string,
    @Body('category') category: string,
    @Body('hasListening') hasListening: string,
  ) {
    const createBookDto: CreateBookDto = {
      title,
      category,
      hasListening: hasListening === 'true' || hasListening === '1',
    };

    return this.adminService.uploadBook(pdf, createBookDto);
  }

  @Post('upload-audio')
  @ApiOperation({
    summary: 'Upload audio file for a book',
    description:
      'Upload an audio file (MP3, WAV, OGG) for a book with listening content',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          format: 'binary',
          description: 'Audio file to upload',
        },
        book_id: { type: 'integer', example: 1 },
      },
      required: ['audio', 'book_id'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Audio uploaded successfully',
    schema: { example: { success: true, audio_id: 1 } },
  })
  @ApiResponse({ status: 400, description: 'Invalid file or book not found' })
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudio(
    @UploadedFile(AudioFileValidationPipe) audio: Express.Multer.File,
    @Body('book_id', ParseIntPipe) bookId: number,
  ) {
    return this.adminService.uploadAudio(audio, bookId);
  }

  @Get('book-status/:id')
  @ApiOperation({
    summary: 'Get book processing status',
    description: 'Check the processing status of an uploaded book',
  })
  @ApiResponse({
    status: 200,
    description: 'Book status retrieved successfully',
    schema: {
      example: {
        book_id: 1,
        status: 'processing',
        processed_pages: 50,
        total_pages: 100,
        message: 'Đang xử lý trang 50/100...',
        progress_percentage: 50,
      },
    },
  })
  async getBookStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getBookStatus(id);
  }

  @Get('books')
  @ApiOperation({ summary: 'Get all books with pagination' })
  async getAllBooks(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.adminService.getAllBooks(page, limit);
  }

  @Get('books/:id')
  @ApiOperation({ summary: 'Get book details with all pages' })
  async getBookDetails(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getBookDetails(id);
  }

  @Put('books/:id')
  @ApiOperation({ summary: 'Update book information' })
  @ApiBody({ type: UpdateBookDto })
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.adminService.updateBook(id, updateBookDto);
  }

  @Delete('books/:id')
  @ApiOperation({ summary: 'Delete a book and all its pages' })
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteBook(id);
  }

  @Post('books/:id/thumbnail')
  @ApiOperation({ summary: 'Upload thumbnail for a book' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(ImageFileValidationPipe) thumbnail: Express.Multer.File,
  ) {
    return this.adminService.uploadThumbnail(id, thumbnail);
  }

  @Put('books/:bookId/thumbnail/page/:pageNumber')
  @ApiOperation({ summary: 'Set a page as thumbnail' })
  async setPageAsThumbnail(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
  ) {
    return this.adminService.setPageAsThumbnail(bookId, pageNumber);
  }

  @Put('pages/:id/replace')
  @ApiOperation({ summary: 'Replace a page image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async replacePage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(ImageFileValidationPipe) image: Express.Multer.File,
  ) {
    return this.adminService.replacePage(id, image);
  }

  @Put('pages/:id/replace-url')
  @ApiOperation({ summary: 'Replace a page image from URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
      },
      required: ['imageUrl'],
    },
  })
  async replacePageFromUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.adminService.replacePageFromUrl(id, imageUrl);
  }

  @Post('books/:id/thumbnail-url')
  @ApiOperation({ summary: 'Upload thumbnail for a book from URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          example: 'https://example.com/thumbnail.jpg',
        },
      },
      required: ['imageUrl'],
    },
  })
  async uploadThumbnailFromUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.adminService.uploadThumbnailFromUrl(id, imageUrl);
  }
}
