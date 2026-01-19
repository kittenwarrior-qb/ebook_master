import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('audio_files')
export class AudioFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id', type: 'integer' })
  bookId: number;

  @Column({ name: 'audio_data', type: 'bytea' })
  audioData: Buffer;

  @Column({ name: 'audio_format', type: 'varchar', length: 10, default: 'mp3' })
  audioFormat: string;

  @Column({ name: 'duration_seconds', type: 'integer', nullable: true })
  durationSeconds: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Book, (book) => book.audioFiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
