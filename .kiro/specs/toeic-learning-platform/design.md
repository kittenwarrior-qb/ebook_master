# Design Document

## Overview

Nền tảng học TOEIC là một web application đơn giản được xây dựng với kiến trúc client-server truyền thống. Hệ thống cho phép người dùng xem nội dung sách và bài test TOEIC được lưu dưới dạng page images, phát audio cho sách có listening, và theo dõi tiến độ học tập cơ bản.

### Design Principles

- **Simplicity First**: Giao diện tối giản, dễ sử dụng, tập trung vào nội dung
- **Performance**: Tối ưu hóa việc load và hiển thị images/audio
- **Responsive**: Hoạt động tốt trên mọi kích thước màn hình
- **Free and Open**: Dự án miễn phí, không có paywall hay premium features

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │         React/Vue Frontend (SPA)                    │    │
│  │  - Homepage (Books & Tests listing)                 │    │
│  │  - Book/Test Viewer                                 │    │
│  │  - Audio Player Component                           │    │
│  │  - Navigation Controls                              │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                       Server Layer                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Backend API (Node.js/Python)                │    │
│  │  - Content API (Books, Tests, Pages)                │    │
│  │  - Upload/Import API                                │    │
│  │  - Progress Tracking API                            │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │         PostgreSQL/MySQL Database                   │    │
│  │  - Books & Tests metadata                           │    │
│  │  - Pages (BLOB storage)                             │    │
│  │  - Audio files (BLOB storage)                       │    │
│  │  - User progress                                    │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ Optional
┌─────────────────────────────────────────────────────────────┐
│                    Import/Processing Layer                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │    PDF Processing Service (n8n workflow)            │    │
│  │  - PDF to Image conversion                          │    │
│  │  - Batch import automation                          │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Recommendations

#### Frontend
- **Framework**: React hoặc Vue.js (đơn giản, phổ biến)
- **Styling**: Tailwind CSS (utility-first, responsive dễ dàng)
- **State Management**: React Context API hoặc Zustand (lightweight)
- **HTTP Client**: Axios hoặc Fetch API
- **Audio Player**: HTML5 Audio API hoặc Howler.js

#### Backend
- **Framework**: NestJS (TypeScript, modular architecture, built-in dependency injection)
  - Ưu điểm: Structure tốt, dễ maintain, TypeScript native, decorators cho routing
  - Phù hợp cho project có thể scale sau này
- **PDF Processing**: 
  - pdf-poppler (convert PDF to images)
  - pdf2pic (Node.js wrapper cho Poppler)
  - Alternative: pdf.js (client-side processing)
- **File Upload**: @nestjs/platform-express với Multer
- **ORM**: TypeORM hoặc Prisma (tích hợp tốt với NestJS)

#### Database
- **Primary Choice**: PostgreSQL
  - Hỗ trợ BLOB storage tốt
  - JSON support cho metadata
  - Free và open source
  - Có thể scale sau này
- **Alternative**: MySQL/MariaDB (nếu quen thuộc hơn)

#### Deployment
- **Hosting**: 
  - Frontend: Vercel, Netlify (free tier)
  - Backend: Railway, Render, Fly.io (free tier)
  - Database: Supabase, Neon (PostgreSQL free tier)
- **Alternative**: VPS đơn giản (DigitalOcean, Vultr) nếu muốn control hoàn toàn

## Data Models

### Database Schema

```sql
-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'book' or 'test'
    has_listening BOOLEAN DEFAULT FALSE,
    total_pages INTEGER NOT NULL,
    thumbnail_url TEXT, -- URL to first page or custom thumbnail
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages table
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    image_data BYTEA NOT NULL, -- BLOB storage for page image
    image_format VARCHAR(10) DEFAULT 'jpeg', -- 'jpeg' or 'png'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, page_number)
);

-- Audio files table
CREATE TABLE audio_files (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    audio_data BYTEA NOT NULL, -- BLOB storage for audio file
    audio_format VARCHAR(10) DEFAULT 'mp3', -- 'mp3', 'wav', etc.
    duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table (optional, có thể dùng localStorage)
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255), -- Session ID hoặc user identifier
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    last_page_number INTEGER NOT NULL,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
);

-- Indexes for performance
CREATE INDEX idx_pages_book_id ON pages(book_id);
CREATE INDEX idx_audio_book_id ON audio_files(book_id);
CREATE INDEX idx_progress_user_book ON user_progress(user_id, book_id);
```

### Entity Relationships

```
books (1) ──────< (N) pages
books (1) ──────< (0..N) audio_files
books (1) ──────< (N) user_progress
```

## Components and Interfaces

### Frontend Components

#### 1. HomePage Component
```
HomePage
├── CategorySection (Books)
│   └── BookCard[] (thumbnail, title, listening badge)
└── CategorySection (Tests)
    └── BookCard[] (thumbnail, title)
```

**Props & State:**
- State: `books[]`, `tests[]`, `loading`
- Fetches data from `/api/books` on mount
- Displays grid layout with book cards

#### 2. BookViewer Component
```
BookViewer
├── NavigationBar (prev, next, page input, total pages)
├── PageDisplay (image viewer)
├── AudioPlayer (conditional, if has_listening)
└── ProgressTracker (auto-save current page)
```

**Props & State:**
- Props: `bookId` (from URL params)
- State: `currentPage`, `totalPages`, `pageImage`, `audioUrl`, `hasListening`
- Fetches page image from `/api/books/:id/pages/:pageNumber`
- Fetches audio from `/api/books/:id/audio` if applicable

#### 3. AudioPlayer Component
```
AudioPlayer
├── PlayPauseButton
├── ProgressBar (seekable)
├── VolumeControl
└── TimeDisplay (current / total)
```

**Props:**
- `audioUrl`: URL to audio file
- `autoPlay`: boolean (optional)

### Backend API Endpoints

#### NestJS Module Structure

```
src/
├── books/
│   ├── books.controller.ts
│   ├── books.service.ts
│   ├── books.module.ts
│   └── dto/
│       ├── create-book.dto.ts
│       └── update-book.dto.ts
├── pages/
│   ├── pages.controller.ts
│   ├── pages.service.ts
│   └── pages.module.ts
├── audio/
│   ├── audio.controller.ts
│   ├── audio.service.ts
│   └── audio.module.ts
├── progress/
│   ├── progress.controller.ts
│   ├── progress.service.ts
│   └── progress.module.ts
└── admin/
    ├── admin.controller.ts
    ├── admin.service.ts
    └── admin.module.ts
```

#### Content APIs

```typescript
// books.controller.ts
@Controller('api/books')
export class BooksController {
  @Get()
  async findAll(): Promise<Book[]> {
    // GET /api/books
    // Response: Array of books with metadata
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Book> {
    // GET /api/books/:id
    // Response: Single book details
  }
}

// pages.controller.ts
@Controller('api/books/:bookId/pages')
export class PagesController {
  @Get(':pageNumber')
  async getPage(
    @Param('bookId') bookId: number,
    @Param('pageNumber') pageNumber: number,
    @Res() res: Response
  ) {
    // GET /api/books/:id/pages/:pageNumber
    // Response: Image file (JPEG/PNG)
    // Headers: Content-Type: image/jpeg
  }
}

// audio.controller.ts
@Controller('api/books/:bookId/audio')
export class AudioController {
  @Get()
  async getAudio(
    @Param('bookId') bookId: number,
    @Res() res: Response
  ) {
    // GET /api/books/:id/audio
    // Response: Audio file (MP3)
    // Headers: Content-Type: audio/mpeg
  }
}
```

#### Upload/Import APIs

```typescript
// admin.controller.ts
@Controller('api/admin')
@UseGuards(AdminGuard) // API key authentication
export class AdminController {
  @Post('upload-book')
  @UseInterceptors(FileInterceptor('pdf'))
  async uploadBook(
    @UploadedFile() pdf: Express.Multer.File,
    @Body() createBookDto: CreateBookDto
  ) {
    // POST /api/admin/upload-book
    // Body: multipart/form-data
    //   - pdf: File
    //   - title: string
    //   - category: 'book' | 'test'
    //   - has_listening: boolean
    // Response: { success: true, book_id: 1, pages_imported: 250 }
  }

  @Post('upload-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudio(
    @UploadedFile() audio: Express.Multer.File,
    @Body('book_id') bookId: number
  ) {
    // POST /api/admin/upload-audio
    // Body: multipart/form-data
    //   - book_id: number
    //   - audio: File
    // Response: { success: true, audio_id: 1 }
  }
}
```

#### Progress APIs

```typescript
// progress.controller.ts
@Controller('api/progress')
export class ProgressController {
  @Get(':bookId')
  async getProgress(@Param('bookId') bookId: number) {
    // GET /api/progress/:bookId
    // Response: { book_id: 1, last_page_number: 45 }
  }

  @Post(':bookId')
  async saveProgress(
    @Param('bookId') bookId: number,
    @Body('page_number') pageNumber: number
  ) {
    // POST /api/progress/:bookId
    // Body: { page_number: 46 }
    // Response: { success: true }
  }
}
```

## PDF Import and Processing Workflow

### Option 1: Server-Side Processing (Recommended)

```
1. Admin uploads PDF via API
   ↓
2. Backend receives file
   ↓
3. Use pdf-poppler/pdf2pic to convert PDF → Images
   ↓
4. For each page:
   - Convert to JPEG (optimize quality/size)
   - Store in database as BYTEA
   - Create page record with page_number
   ↓
5. Create book record with metadata
   ↓
6. Return success response
```

**Implementation (NestJS + pdf2pic):**

```typescript
// admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fromPath } from 'pdf2pic';
import { Book } from './entities/book.entity';
import { Page } from './entities/page.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
  ) {}

  async processPDF(
    pdfPath: string,
    bookTitle: string,
    category: string,
    hasListening: boolean
  ): Promise<number> {
    // Convert PDF to images
    const options = {
      density: 150,           // DPI
      saveFilename: bookTitle,
      savePath: './temp',
      format: 'jpeg',
      width: 1200,
      height: 1600
    };
    
    const convert = fromPath(pdfPath, options);
    const pageCount = await this.getPageCount(pdfPath);
    
    // Create book record
    const book = this.booksRepository.create({
      title: bookTitle,
      category,
      hasListening,
      totalPages: pageCount
    });
    await this.booksRepository.save(book);
    
    // Convert and store each page
    for (let i = 1; i <= pageCount; i++) {
      const pageResult = await convert(i, { responseType: 'buffer' });
      
      const page = this.pagesRepository.create({
        bookId: book.id,
        pageNumber: i,
        imageData: pageResult.buffer,
        imageFormat: 'jpeg'
      });
      await this.pagesRepository.save(page);
    }
    
    return book.id;
  }
  
  private async getPageCount(pdfPath: string): Promise<number> {
    // Use pdf-parse or similar library
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.numpages;
  }
}
```

### Option 2: n8n Workflow Integration

```
n8n Workflow:
1. Trigger: Webhook (receive PDF upload)
   ↓
2. Save PDF to temp storage
   ↓
3. Execute Command: pdf2image conversion
   ↓
4. Loop through images:
   - Read image file
   - HTTP Request to backend API
   - POST /api/admin/upload-page
   ↓
5. Clean up temp files
   ↓
6. Send completion notification
```

**Benefits:**
- Visual workflow editor
- Easy to modify without code changes
- Can add email notifications, logging, etc.
- Separate from main application

### Option 3: Client-Side Processing (Not Recommended)

Using pdf.js in browser - không khuyến khích vì:
- Large PDFs sẽ làm browser lag
- Phụ thuộc vào device của user
- Khó control quality và format

## Error Handling

### Frontend Error Handling

```typescript
// API call with error handling (using axios interceptor)
async function fetchBookPages(bookId: number, pageNumber: number) {
  try {
    const response = await axios.get(`/api/books/${bookId}/pages/${pageNumber}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        showNotification('Không tìm thấy trang này', 'error');
      } else if (error.response?.status === 500) {
        showNotification('Lỗi server, vui lòng thử lại', 'error');
      } else {
        showNotification('Không thể tải trang, kiểm tra kết nối', 'error');
      }
    }
    return null;
  }
}
```

### Backend Error Handling

```typescript
// NestJS exception filters
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

// Use in main.ts
app.useGlobalFilters(new AllExceptionsFilter());
```

### Common Error Scenarios

1. **Page not found**: Return 404, show friendly message
2. **Audio file missing**: Hide audio player, show notice
3. **Image load failure**: Show placeholder, retry button
4. **Upload failure**: Show error, allow retry
5. **Database connection error**: Show maintenance message

## Performance Optimization

### Image Optimization

```javascript
// Optimize images during PDF conversion
const options = {
  density: 150,        // Balance between quality and size
  format: 'jpeg',      // JPEG smaller than PNG for photos
  quality: 85,         // Good quality, reasonable size
  width: 1200,         // Max width for desktop
  height: 1600         // Maintain aspect ratio
};

// Progressive JPEG for better perceived loading
const sharp = require('sharp');
await sharp(imageBuffer)
  .jpeg({ quality: 85, progressive: true })
  .toBuffer();
```

### Database Query Optimization

```sql
-- Use pagination for book listing
SELECT * FROM books 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;

-- Fetch only necessary columns
SELECT id, title, category, has_listening, total_pages 
FROM books;

-- Use prepared statements to prevent SQL injection
```

### Caching Strategy

```javascript
// Frontend: Cache page images in memory
const pageCache = new Map();

function getCachedPage(bookId, pageNumber) {
  const key = `${bookId}-${pageNumber}`;
  if (pageCache.has(key)) {
    return pageCache.get(key);
  }
  return null;
}

// Backend: Set cache headers
res.set('Cache-Control', 'public, max-age=31536000'); // 1 year for images
```

### Lazy Loading

```javascript
// Preload adjacent pages for smooth navigation
useEffect(() => {
  if (currentPage < totalPages) {
    preloadImage(`/api/books/${bookId}/pages/${currentPage + 1}`);
  }
  if (currentPage > 1) {
    preloadImage(`/api/books/${bookId}/pages/${currentPage - 1}`);
  }
}, [currentPage]);
```

## Testing Strategy

### Unit Tests

**Frontend:**
- Component rendering tests (React Testing Library)
- State management logic
- Utility functions (page navigation, progress tracking)

**Backend:**
- API endpoint tests (Jest + Supertest)
- Database query functions
- PDF processing functions

### Integration Tests

- Full user flow: Homepage → Select book → Navigate pages
- Audio playback with page navigation
- Progress saving and restoration
- PDF upload and conversion workflow

### Manual Testing Checklist

- [ ] Homepage loads and displays books/tests correctly
- [ ] Book viewer displays pages in correct order
- [ ] Navigation buttons work (prev, next, jump to page)
- [ ] Audio player works for books with listening
- [ ] Progress is saved and restored correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] PDF upload and conversion works correctly
- [ ] Error messages display appropriately

### Performance Testing

- Page load time < 2 seconds
- Image load time < 1 second per page
- Audio streaming starts within 1 second
- Database queries < 100ms
- PDF conversion: ~1 second per page

## Security Considerations

### Input Validation

```typescript
// NestJS DTOs with class-validator
import { IsString, IsBoolean, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsEnum(['book', 'test'])
  category: string;

  @IsBoolean()
  hasListening: boolean;
}

// File validation pipe
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedMimeTypes = ['application/pdf'];
    
    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException('Only PDF files allowed');
    }
    
    if (value.size > maxSize) {
      throw new BadRequestException('File too large');
    }
    
    return value;
  }
}
```

### SQL Injection Prevention

```typescript
// TypeORM automatically prevents SQL injection with parameterized queries
const book = await this.booksRepository.findOne({
  where: { id: bookId }  // Safe, parameterized
});

// Query builder is also safe
const books = await this.booksRepository
  .createQueryBuilder('book')
  .where('book.category = :category', { category: 'book' })
  .getMany();

// NEVER do raw queries without parameters:
// await this.booksRepository.query(`SELECT * FROM books WHERE id = ${bookId}`); // UNSAFE!
```

### Admin API Protection

```typescript
// NestJS Guard for API key authentication
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const adminApiKey = this.configService.get<string>('ADMIN_API_KEY');

    if (apiKey !== adminApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}

// Usage in controller
@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  // All routes protected
}
```

### CORS Configuration

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  await app.listen(3001);
}
bootstrap();
```

## Deployment Architecture

### Simple Deployment (Recommended for MVP)

```
Frontend (Vercel/Netlify)
    ↓
Backend + Database (Railway/Render)
```

**Steps:**
1. Deploy PostgreSQL database on Railway/Supabase
2. Deploy backend API on Railway/Render
3. Deploy frontend on Vercel/Netlify
4. Configure environment variables

### Alternative: Single VPS Deployment

```
VPS (DigitalOcean/Vultr)
├── Nginx (reverse proxy)
├── Node.js Backend (PM2)
├── PostgreSQL Database
└── Frontend (static files served by Nginx)
```

## Future Enhancements (Out of Scope for MVP)

- User authentication system
- Bookmarks and notes
- Search functionality
- Multiple audio tracks per book
- Admin dashboard UI
- Analytics and usage tracking
- Mobile app (React Native)
- Offline mode with service workers
