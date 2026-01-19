import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Page } from './page.entity';
import { AudioFile } from './audio-file.entity';
import { UserProgress } from './user-progress.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  category: string; // 'book' or 'test'

  @Column({ name: 'has_listening', type: 'boolean', default: false })
  hasListening: boolean;

  @Column({ name: 'total_pages', type: 'integer' })
  totalPages: number;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Page, (page) => page.book, { cascade: true })
  pages: Page[];

  @OneToMany(() => AudioFile, (audioFile) => audioFile.book, { cascade: true })
  audioFiles: AudioFile[];

  @OneToMany(() => UserProgress, (progress) => progress.book)
  userProgress: UserProgress[];
}
