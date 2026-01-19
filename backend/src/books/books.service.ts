import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { BookResponseDto } from './dto/book-response.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.booksRepository.find({
      order: { createdAt: 'DESC' },
    });

    return books.map((book) => this.toResponseDto(book));
  }

  async findOne(id: number): Promise<BookResponseDto> {
    const book = await this.booksRepository.findOne({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return this.toResponseDto(book);
  }

  async findByCategory(category: string): Promise<BookResponseDto[]> {
    const books = await this.booksRepository.find({
      where: { category },
      order: { createdAt: 'DESC' },
    });

    return books.map((book) => this.toResponseDto(book));
  }

  private toResponseDto(book: Book): BookResponseDto {
    return {
      id: book.id,
      title: book.title,
      category: book.category,
      hasListening: book.hasListening,
      totalPages: book.totalPages,
      thumbnailUrl: book.thumbnailUrl || `/api/books/${book.id}/pages/1`,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  }
}
