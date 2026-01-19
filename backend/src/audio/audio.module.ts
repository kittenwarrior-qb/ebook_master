import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioFile } from '../entities/audio-file.entity';
import { Book } from '../entities/book.entity';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';

@Module({
  imports: [TypeOrmModule.forFeature([AudioFile, Book])],
  controllers: [AudioController],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}
