import { IsInt, Min } from 'class-validator';

export class SaveProgressDto {
  @IsInt()
  @Min(1)
  page_number: number;
}
