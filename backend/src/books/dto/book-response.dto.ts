import { ApiProperty } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty({ description: 'Book ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Book title', example: 'Hackers TOEIC Listening' })
  title: string;

  @ApiProperty({ description: 'Book category', enum: ['book', 'test'], example: 'book' })
  category: string;

  @ApiProperty({ description: 'Whether the book has listening content', example: true })
  hasListening: boolean;

  @ApiProperty({ description: 'Total number of pages', example: 120 })
  totalPages: number;

  @ApiProperty({ description: 'Thumbnail URL', example: '/api/books/1/pages/1' })
  thumbnailUrl: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
