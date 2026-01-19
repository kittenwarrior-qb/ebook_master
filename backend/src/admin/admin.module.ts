import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, Page, AudioFile } from '../entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Page, AudioFile]),
    CloudinaryModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
