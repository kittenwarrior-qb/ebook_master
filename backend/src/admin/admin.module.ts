import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Book, Page, AudioFile } from '../entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Page, AudioFile]),
    CloudinaryModule,
    MulterModule.register({
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
