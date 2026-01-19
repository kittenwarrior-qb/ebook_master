import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PagesService } from './pages.service';

@Controller('api/books/:bookId/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':pageNumber')
  async getPage(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
    @Res() res: Response,
  ) {
    try {
      const { data, format } = await this.pagesService.getPageImage(
        bookId,
        pageNumber,
      );

      // Set content type based on format
      const contentType = format === 'png' ? 'image/png' : 'image/jpeg';
      
      // Set cache headers for better performance
      res.set({
        'Content-Type': contentType,
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
