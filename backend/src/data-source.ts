import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Book, Page, AudioFile, UserProgress } from './entities';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'ebook_master',
  entities: [Book, Page, AudioFile, UserProgress],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Never use synchronize in production
  logging: true,
});
