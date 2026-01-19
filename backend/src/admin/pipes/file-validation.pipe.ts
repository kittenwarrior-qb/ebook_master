import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PdfFileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const maxSize = 500 * 1024 * 1024; // 500MB
    const allowedMimeTypes = ['application/pdf'];

    if (!value) {
      throw new BadRequestException('PDF file is required');
    }

    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException('Only PDF files are allowed');
    }

    if (value.size > maxSize) {
      throw new BadRequestException('File size exceeds 500MB limit');
    }

    return value;
  }
}

@Injectable()
export class AudioFileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const maxSize = 100 * 1024 * 1024; // 100MB for audio
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
    ];

    if (!value) {
      throw new BadRequestException('Audio file is required');
    }

    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        'Only MP3, WAV, or OGG audio files are allowed',
      );
    }

    if (value.size > maxSize) {
      throw new BadRequestException('File size exceeds 100MB limit');
    }

    return value;
  }
}

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const maxSize = 10 * 1024 * 1024; // 10MB for images
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!value) {
      throw new BadRequestException('Image file is required');
    }

    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException('Only JPEG or PNG images are allowed');
    }

    if (value.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    return value;
  }
}
