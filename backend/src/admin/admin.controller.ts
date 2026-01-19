import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';
import { CreateBookDto } from './dto/create-book.dto';
import {
  PdfFileValidationPipe,
  AudioFileValidationPipe,
} from './pipes/file-validation.pipe';

@ApiTags('admin')
@ApiSecurity('admin-key')
@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('upload-book')
  @ApiOperation({ summary: 'Upload a new book PDF', description: 'Upload a PDF file and create a new book with metadata' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pdf: { type: 'string', format: 'binary', description: 'PDF file to upload' },
        title: { type: 'string', example: 'Hackers TOEIC Listening' },
        category: { type: 'string', enum: ['book', 'test'], example: 'book' },
        hasListening: { type: 'string', enum: ['true', 'false', '1', '0'], example: 'true' },
      },
      required: ['pdf', 'title', 'category', 'hasListening'],
    },
  })
  @ApiResponse({ status: 201, description: 'Book uploaded successfully', schema: { example: { success: true, book_id: 1, pages_imported: 120 } } })
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
  @ApiOperation({ summary: 'Upload audio file for a book', description: 'Upload an audio file (MP3, WAV, OGG) for a book with listening content' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        audio: { type: 'string', format: 'binary', description: 'Audio file to upload' },
        book_id: { type: 'integer', example: 1 },
      },
      required: ['audio', 'book_id'],
    },
  })
  @ApiResponse({ status: 201, description: 'Audio uploaded successfully', schema: { example: { success: true, audio_id: 1 } } })
  @ApiResponse({ status: 400, description: 'Invalid file or book not found' })
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudio(
    @UploadedFile(AudioFileValidationPipe) audio: Express.Multer.File,
    @Body('book_id', ParseIntPipe) bookId: number,
  ) {
    return this.adminService.uploadAudio(audio, bookId);
  }
}
