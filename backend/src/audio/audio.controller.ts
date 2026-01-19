import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiProduces,
} from '@nestjs/swagger';
import { AudioService } from './audio.service';

@ApiTags('audio')
@Controller('api/books/:bookId/audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  @ApiOperation({
    summary: 'Get audio file for a book',
    description: 'Stream the audio file associated with a book',
  })
  @ApiParam({ name: 'bookId', type: 'integer', description: 'Book ID' })
  @ApiProduces('audio/mpeg', 'audio/wav', 'audio/ogg')
  @ApiResponse({ status: 200, description: 'Audio file stream' })
  @ApiResponse({ status: 404, description: 'Audio file not found' })
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
