import { IsString, IsEnum, IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsEnum(['book', 'test'])
  category: string;

  @IsBoolean()
  hasListening: boolean;
}
