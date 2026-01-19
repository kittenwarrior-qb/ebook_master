import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('pages')
@Index(['bookId', 'pageNumber'], { unique: true })
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id', type: 'integer' })
  bookId: number;

  @Column({ name: 'page_number', type: 'integer' })
  pageNumber: number;

  // Store Cloudinary URL instead of binary data
  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ name: 'cloudinary_public_id', type: 'varchar', length: 255 })
  cloudinaryPublicId: string;

  @Column({
    name: 'image_format',
    type: 'varchar',
    length: 10,
    default: 'jpeg',
  })
  imageFormat: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Book, (book) => book.pages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
