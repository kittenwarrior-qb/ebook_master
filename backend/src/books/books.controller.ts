import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { BookResponseDto } from './dto/book-response.dto';

@ApiTags('books')
@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all books',
    description: 'Retrieve all books, optionally filtered by category',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ['book', 'test'],
    description: 'Filter by category',
  })
  @ApiResponse({
    status: 200,
    description: 'List of books',
    type: [BookResponseDto],
  })
  async findAll(
    @Query('category') category?: string,
  ): Promise<BookResponseDto[]> {
    if (category) {
      return this.booksService.findByCategory(category);
    }
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get book by ID',
    description: 'Retrieve a specific book by its ID',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'Book ID' })
  @ApiResponse({
    status: 200,
    description: 'Book details',
    type: BookResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookResponseDto> {
    return this.booksService.findOne(id);
  }
}
