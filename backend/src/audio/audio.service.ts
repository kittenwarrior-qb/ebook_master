import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioFile } from '../entities/audio-file.entity';
import { Book } from '../entities/book.entity';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioFile)
    private audioRepository: Repository<AudioFile>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAudioByBookId(bookId: number): Promise<AudioFile> {
    // First check if book exists and has listening
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    if (!book.hasListening) {
      throw new NotFoundException(
        `Book with ID ${bookId} does not have audio content`,
      );
    }

    const audio = await this.audioRepository.findOne({
      where: { bookId },
    });

    if (!audio) {
      throw new NotFoundException(`Audio not found for book ${bookId}`);
    }

    return audio;
  }

  async getAudioFile(bookId: number): Promise<{
    data: Buffer;
    format: string;
  }> {
    const audio = await this.findAudioByBookId(bookId);
    return {
      data: audio.audioData,
      format: audio.audioFormat,
    };
  }
}
