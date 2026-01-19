import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveProgressDto {
  @ApiProperty({ description: 'Current page number', example: 15, minimum: 1 })
  @IsInt()
  @Min(1)
  page_number: number;
}
