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
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';
import { CreateBookDto } from './dto/create-book.dto';
import {
  PdfFileValidationPipe,
  AudioFileValidationPipe,
} from './pipes/file-validation.pipe';

@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('upload-book')
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
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudio(
    @UploadedFile(AudioFileValidationPipe) audio: Express.Multer.File,
    @Body('book_id', ParseIntPipe) bookId: number,
  ) {
    return this.adminService.uploadAudio(audio, bookId);
  }
}
