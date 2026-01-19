import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from '../entities/user-progress.entity';
import { ProgressResponseDto } from './dto/progress-response.dto';
import { SaveProgressDto } from './dto/save-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private progressRepository: Repository<UserProgress>,
  ) {}

  async getProgress(
    userId: string,
    bookId: number,
  ): Promise<ProgressResponseDto | null> {
    const progress = await this.progressRepository.findOne({
      where: { userId, bookId },
    });

    if (!progress) {
      return null;
    }

    return {
      book_id: progress.bookId,
      last_page_number: progress.lastPageNumber,
      last_accessed_at: progress.lastAccessedAt,
    };
  }

  async saveProgress(
    userId: string,
    bookId: number,
    saveProgressDto: SaveProgressDto,
  ): Promise<{ success: boolean }> {
    const existingProgress = await this.progressRepository.findOne({
      where: { userId, bookId },
    });

    if (existingProgress) {
      // Update existing progress
      existingProgress.lastPageNumber = saveProgressDto.page_number;
      existingProgress.lastAccessedAt = new Date();
      await this.progressRepository.save(existingProgress);
    } else {
      // Create new progress
      const newProgress = this.progressRepository.create({
        userId,
        bookId,
        lastPageNumber: saveProgressDto.page_number,
        lastAccessedAt: new Date(),
      });
      await this.progressRepository.save(newProgress);
    }

    return { success: true };
  }

  async getAllProgressForUser(userId: string): Promise<ProgressResponseDto[]> {
    const progressList = await this.progressRepository.find({
      where: { userId },
      order: { lastAccessedAt: 'DESC' },
    });

    return progressList.map((progress) => ({
      book_id: progress.bookId,
      last_page_number: progress.lastPageNumber,
      last_accessed_at: progress.lastAccessedAt,
    }));
  }
}
