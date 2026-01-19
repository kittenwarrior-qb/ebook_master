import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('user_progress')
@Index(['userId', 'bookId'], { unique: true })
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string; // Session ID or user identifier

  @Column({ name: 'book_id', type: 'integer' })
  bookId: number;

  @Column({ name: 'last_page_number', type: 'integer' })
  lastPageNumber: number;

  @Column({
    name: 'last_accessed_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastAccessedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Book, (book) => book.userProgress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
