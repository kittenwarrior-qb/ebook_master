import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { SaveProgressDto } from './dto/save-progress.dto';
import { ProgressResponseDto } from './dto/progress-response.dto';

@ApiTags('books')
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
  @ApiOperation({
    summary: 'Get reading progress',
    description: 'Get the reading progress for a specific book',
  })
  @ApiParam({ name: 'bookId', type: 'integer', description: 'Book ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for tracking user progress',
  })
  @ApiResponse({
    status: 200,
    description: 'Reading progress',
    type: ProgressResponseDto,
  })
  async getProgress(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Headers() headers: any,
  ): Promise<
    ProgressResponseDto | { book_id: number; last_page_number: number }
  > {
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
  @ApiOperation({
    summary: 'Save reading progress',
    description: 'Save the current reading progress for a book',
  })
  @ApiParam({ name: 'bookId', type: 'integer', description: 'Book ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for tracking user progress',
  })
  @ApiBody({ type: SaveProgressDto })
  @ApiResponse({
    status: 200,
    description: 'Progress saved successfully',
    schema: { example: { success: true } },
  })
  async saveProgress(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() saveProgressDto: SaveProgressDto,
    @Headers() headers: any,
  ): Promise<{ success: boolean }> {
    const userId = this.getUserId(headers);
    return this.progressService.saveProgress(userId, bookId, saveProgressDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all reading progress',
    description: 'Get reading progress for all books for the current user',
  })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for tracking user progress',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reading progress',
    type: [ProgressResponseDto],
  })
  async getAllProgress(
    @Headers() headers: any,
  ): Promise<ProgressResponseDto[]> {
    const userId = this.getUserId(headers);
    return this.progressService.getAllProgressForUser(userId);
  }
}
