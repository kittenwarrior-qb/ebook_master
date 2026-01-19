import { ApiProperty } from '@nestjs/swagger';

export class ProgressResponseDto {
  @ApiProperty({ description: 'Book ID', example: 1 })
  book_id: number;

  @ApiProperty({ description: 'Last page number read', example: 15 })
  last_page_number: number;

  @ApiProperty({ description: 'Last access timestamp' })
  last_accessed_at: Date;
}
