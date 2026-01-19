import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AudioService } from './audio.service';

@Controller('api/books/:bookId/audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  async getAudio(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() res: Response,
  ) {
    try {
      const { data, format } = await this.audioService.getAudioFile(bookId);

      // Set content type based on format
      let contentType = 'audio/mpeg'; // default for mp3
      if (format === 'wav') {
        contentType = 'audio/wav';
      } else if (format === 'ogg') {
        contentType = 'audio/ogg';
      }

      // Set headers for audio streaming
      res.set({
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000', // 1 year
        'Content-Length': data.length,
      });

      res.status(HttpStatus.OK).send(data);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }
}
