import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../entities/page.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
  ) {}

  async findPage(bookId: number, pageNumber: number): Promise<Page> {
    const page = await this.pagesRepository.findOne({
      where: { bookId, pageNumber },
    });

    if (!page) {
      throw new NotFoundException(
        `Page ${pageNumber} not found for book ${bookId}`,
      );
    }

    return page;
  }

  async getPageImage(bookId: number, pageNumber: number): Promise<{
    data: Buffer;
    format: string;
  }> {
    const page = await this.findPage(bookId, pageNumber);
    return {
      data: page.imageData,
      format: page.imageFormat,
    };
  }
}
