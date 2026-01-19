import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    buffer: Buffer,
    folder: string,
    publicId: string,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: 'image',
          format: 'jpg',
          quality: 'auto:good',
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Upload failed'));
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const streamifier = require('streamifier');
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  async deleteFolder(folder: string): Promise<void> {
    await cloudinary.api.delete_resources_by_prefix(folder);
    await cloudinary.api.delete_folder(folder);
  }
}
