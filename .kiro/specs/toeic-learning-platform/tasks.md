# Implementation Plan

- [x] 1. Set up project structure and development environment



  - Initialize NestJS backend project with TypeScript configuration
  - Initialize React frontend project with Vite and TypeScript
  - Set up PostgreSQL database (local or cloud)
  - Configure environment variables for both frontend and backend
  - Set up Git repository with .gitignore files
  - _Requirements: 2.1, 3.1_

- [x] 2. Implement database schema and entities


  - [x] 2.1 Create TypeORM entities for Books, Pages, AudioFiles, and UserProgress


    - Define Book entity with fields: id, title, category, hasListening, totalPages, thumbnailUrl, timestamps
    - Define Page entity with fields: id, bookId, pageNumber, imageData (bytea), imageFormat
    - Define AudioFile entity with fields: id, bookId, audioData (bytea), audioFormat, durationSeconds
    - Define UserProgress entity with fields: id, userId, bookId, lastPageNumber, lastAccessedAt
    - Set up entity relationships (one-to-many, foreign keys)
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 2.2 Create and run database migrations


    - Generate TypeORM migrations from entities
    - Run migrations to create tables and indexes
    - Verify database schema matches design
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Implement backend core modules and services


  - [x] 3.1 Create Books module with controller and service


    - Implement GET /api/books endpoint to fetch all books
    - Implement GET /api/books/:id endpoint to fetch single book details
    - Add DTOs for book responses
    - _Requirements: 1.1, 1.2, 2.5_

  - [x] 3.2 Create Pages module with controller and service


    - Implement GET /api/books/:bookId/pages/:pageNumber endpoint
    - Stream image data from database as JPEG/PNG response
    - Set appropriate Content-Type headers
    - Add caching headers for performance
    - _Requirements: 2.1, 4.1, 6.1_

  - [x] 3.3 Create Audio module with controller and service


    - Implement GET /api/books/:bookId/audio endpoint
    - Stream audio data from database as MP3 response
    - Set appropriate Content-Type headers
    - Handle cases where book has no audio
    - _Requirements: 2.2, 5.1_

  - [x] 3.4 Create Progress module with controller and service


    - Implement GET /api/progress/:bookId endpoint to fetch user progress
    - Implement POST /api/progress/:bookId endpoint to save progress
    - Use session ID or generated user ID for tracking
    - _Requirements: 7.1, 7.2, 7.3_





- [ ] 4. Implement PDF processing and admin upload functionality
  - [ ] 4.1 Set up PDF processing dependencies
    - Install pdf2pic, pdf-parse, and sharp packages


    - Configure Poppler for PDF to image conversion
    - Create temp directory for processing files
    - _Requirements: 3.2_

  - [x] 4.2 Create Admin module with upload endpoints

    - Implement POST /api/admin/upload-book endpoint with file upload
    - Implement POST /api/admin/upload-audio endpoint
    - Add AdminGuard for API key authentication
    - Create DTOs for upload requests with validation
    - _Requirements: 3.1, 3.4_

  - [x] 4.3 Implement PDF to image conversion service

    - Create service method to convert PDF pages to JPEG images
    - Optimize image quality and size (density: 150, quality: 85)
    - Store each page image as BYTEA in database
    - Handle errors during conversion process
    - Clean up temporary files after processing

    - _Requirements: 3.2, 3.3_


  - [ ] 4.4 Implement audio file upload service
    - Accept audio file uploads (MP3, WAV formats)
    - Store audio data as BYTEA in database
    - Associate audio with corresponding book

    - Calculate and store audio duration
    - _Requirements: 3.4_

- [ ] 5. Implement error handling and validation
  - [ ] 5.1 Add global exception filter
    - Create AllExceptionsFilter for consistent error responses

    - Handle HttpException and generic errors
    - Return structured error JSON with status codes
    - _Requirements: All_





  - [ ] 5.2 Add validation pipes and DTOs
    - Create CreateBookDto with class-validator decorators
    - Create FileSizeValidationPipe for file uploads

    - Validate file types (PDF, MP3) and sizes (max 50MB)
    - Add validation for page numbers and book IDs
    - _Requirements: 3.1, 3.4_

  - [x] 5.3 Add CORS configuration


    - Enable CORS in main.ts with frontend URL
    - Configure credentials and allowed origins
    - _Requirements: All_





- [ ] 6. Implement frontend routing and layout
  - [ ] 6.1 Set up React Router and basic layout
    - Install react-router-dom


    - Create routes for HomePage (/) and BookViewer (/:bookId)
    - Create basic Layout component with header
    - _Requirements: 1.5, 8.1_

  - [ ] 6.2 Set up Tailwind CSS and styling
    - Install and configure Tailwind CSS

    - Create base styles for minimalist design
    - Set up responsive breakpoints
    - _Requirements: 8.1, 8.2, 8.4_





  - [ ] 6.3 Create API client service
    - Set up Axios instance with base URL
    - Create API methods for books, pages, audio, progress
    - Add error handling interceptors
    - _Requirements: All_


- [ ] 7. Implement HomePage component
  - [ ] 7.1 Create HomePage component with category sections
    - Fetch books and tests from API on mount
    - Separate books and tests into two categories
    - Display loading state while fetching

    - _Requirements: 1.1, 1.4_

  - [ ] 7.2 Create BookCard component
    - Display book thumbnail (first page image)
    - Show book title

    - Add listening badge icon for books with audio
    - Make card clickable to navigate to BookViewer
    - Style with Tailwind for clean, minimal design
    - _Requirements: 1.2, 1.3, 8.4_




  - [ ] 7.3 Implement responsive grid layout
    - Use CSS Grid for book cards
    - Adapt columns based on screen size (1 col mobile, 2-3 tablet, 4 desktop)
    - Add hover effects for better UX

    - _Requirements: 8.2_

- [ ] 8. Implement BookViewer component
  - [ ] 8.1 Create BookViewer component with page display
    - Fetch book details from API using bookId from URL
    - Display current page image

    - Show loading state while fetching page
    - Handle image load errors with placeholder
    - _Requirements: 4.1, 6.1_



  - [ ] 8.2 Implement navigation controls
    - Add Previous and Next buttons
    - Add page number input for jumping to specific page
    - Display current page / total pages
    - Disable Previous on first page, Next on last page

    - _Requirements: 4.2, 4.3, 4.4, 6.2, 6.3, 6.4_

  - [ ] 8.3 Implement page preloading for smooth navigation
    - Preload next and previous page images in background
    - Cache loaded pages in memory (Map or state)
    - Improve perceived performance

    - _Requirements: 8.3_

  - [ ] 8.4 Implement progress tracking
    - Save current page to backend when page changes



    - Load last viewed page when returning to book
    - Show "Continue" indicator on HomePage for books in progress
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 9. Implement AudioPlayer component
  - [x] 9.1 Create AudioPlayer component with HTML5 audio

    - Conditionally render player only for books with listening
    - Fetch audio file from API
    - Create audio element with controls
    - _Requirements: 5.1_

  - [x] 9.2 Add custom audio controls


    - Implement Play/Pause button
    - Add seekable progress bar
    - Add volume control slider
    - Display current time / total duration


    - _Requirements: 5.2, 5.3, 5.4_


  - [ ] 9.3 Ensure audio persists during page navigation
    - Keep audio playing when user navigates between pages
    - Maintain audio state across page changes
    - _Requirements: 5.5_


- [ ] 10. Implement responsive design and optimization
  - [ ] 10.1 Optimize image loading and display
    - Add lazy loading for images
    - Implement responsive image sizing
    - Add loading skeletons for better UX

    - _Requirements: 8.3_

  - [ ] 10.2 Test and fix responsive layout on all devices
    - Test on mobile (320px - 768px)
    - Test on tablet (768px - 1024px)
    - Test on desktop (1024px+)
    - Fix any layout issues
    - _Requirements: 8.2_

  - [ ] 10.3 Add error boundaries and fallback UI
    - Create ErrorBoundary component
    - Add fallback UI for component errors
    - Display user-friendly error messages
    - _Requirements: All_

- [ ] 11. Testing and documentation
  - [ ] 11.1 Write backend unit tests
    - Test BooksService methods
    - Test PagesService methods
    - Test AdminService PDF processing
    - Test API endpoints with Supertest
    - _Requirements: All_

  - [ ] 11.2 Write frontend component tests
    - Test HomePage rendering and data fetching
    - Test BookViewer navigation logic
    - Test AudioPlayer controls
    - Use React Testing Library
    - _Requirements: All_

  - [ ] 11.3 Create README documentation
    - Document project setup instructions
    - Document environment variables
    - Document API endpoints
    - Add deployment instructions
    - _Requirements: All_

- [ ] 12. Deployment preparation
  - [ ] 12.1 Configure production environment variables
    - Set up environment files for production
    - Configure database connection strings
    - Set CORS origins for production frontend URL
    - Generate and set ADMIN_API_KEY
    - _Requirements: All_

  - [ ] 12.2 Build and test production builds
    - Build frontend for production (npm run build)
    - Build backend for production
    - Test production builds locally
    - _Requirements: All_

  - [ ] 12.3 Deploy to hosting platforms
    - Deploy PostgreSQL database to Railway/Supabase
    - Deploy NestJS backend to Railway/Render
    - Deploy React frontend to Vercel/Netlify
    - Verify all services are connected and working
    - _Requirements: All_
