import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiProduces } from '@nestjs/swagger';
import { PagesService } from './pages.service';

@ApiTags('books')
@Controller('api/books/:bookId/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':pageNumber')
  @ApiOperation({ summary: 'Get page image', description: 'Retrieve a specific page image from a book' })
  @ApiParam({ name: 'bookId', type: 'integer', description: 'Book ID' })
  @ApiParam({ name: 'pageNumber', type: 'integer', description: 'Page number' })
  @ApiProduces('image/jpeg', 'image/png')
  @ApiResponse({ status: 200, description: 'Page image' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async getPage(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
    @Res() res: Response,
  ) {
    try {
      const { url } = await this.pagesService.getPageImage(bookId, pageNumber);

      // Redirect to Cloudinary URL
      res.redirect(url);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }
}
