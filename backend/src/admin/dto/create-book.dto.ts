import {
  IsString,
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Book title',
    example: 'Hackers TOEIC Listening',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Book category',
    enum: ['book', 'test'],
    example: 'book',
  })
  @IsEnum(['book', 'test'])
  category: string;

  @ApiProperty({
    description: 'Whether the book has listening content',
    example: true,
  })
  @IsBoolean()
  hasListening: boolean;
}
