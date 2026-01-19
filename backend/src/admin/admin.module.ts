import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, Page, AudioFile } from '../entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Page, AudioFile])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
