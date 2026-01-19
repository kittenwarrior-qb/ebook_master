import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Book, Page, AudioFile, UserProgress } from './entities';
import { BooksModule } from './books/books.module';
import { PagesModule } from './pages/pages.module';
import { AudioModule } from './audio/audio.module';
import { ProgressModule } from './progress/progress.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Book, Page, AudioFile, UserProgress],
        synchronize: configService.get('NODE_ENV') === 'development', // Only for development
        logging: configService.get('NODE_ENV') === 'development',
        // SSL configuration for Supabase and other cloud databases
        ssl:
          configService.get('DB_HOST') !== 'localhost'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
    BooksModule,
    PagesModule,
    AudioModule,
    ProgressModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
