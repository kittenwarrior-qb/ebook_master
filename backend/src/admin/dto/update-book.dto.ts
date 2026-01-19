import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  hasListening?: boolean;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
