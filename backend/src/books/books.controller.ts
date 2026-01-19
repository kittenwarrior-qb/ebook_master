import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { BookResponseDto } from './dto/book-response.dto';

@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
  ): Promise<BookResponseDto[]> {
    if (category) {
      return this.booksService.findByCategory(category);
    }
    return this.booksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookResponseDto> {
    return this.booksService.findOne(id);
  }
}
