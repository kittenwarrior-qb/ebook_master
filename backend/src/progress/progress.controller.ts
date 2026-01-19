import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { SaveProgressDto } from './dto/save-progress.dto';
import { ProgressResponseDto } from './dto/progress-response.dto';

@Controller('api/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Helper to get user ID from session or generate one
  private getUserId(headers: any): string {
    // For now, use a simple session ID from headers
    // In production, you might use cookies or proper session management
    return headers['x-session-id'] || 'anonymous';
  }

  @Get(':bookId')
  async getProgress(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Headers() headers: any,
  ): Promise<ProgressResponseDto | { book_id: number; last_page_number: number }> {
    const userId = this.getUserId(headers);
    const progress = await this.progressService.getProgress(userId, bookId);

    if (!progress) {
      // Return default progress if none exists
      return {
        book_id: bookId,
        last_page_number: 1,
      };
    }

    return progress;
  }

  @Post(':bookId')
  async saveProgress(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() saveProgressDto: SaveProgressDto,
    @Headers() headers: any,
  ): Promise<{ success: boolean }> {
    const userId = this.getUserId(headers);
    return this.progressService.saveProgress(userId, bookId, saveProgressDto);
  }

  @Get()
  async getAllProgress(
    @Headers() headers: any,
  ): Promise<ProgressResponseDto[]> {
    const userId = this.getUserId(headers);
    return this.progressService.getAllProgressForUser(userId);
  }
}
