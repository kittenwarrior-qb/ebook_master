# Requirements Document

## Introduction

Nền tảng học TOEIC miễn phí là một hệ thống học tập trực tuyến đơn giản giúp người học TOEIC có thể truy cập nội dung từ các đầu sách như Hacker TOEIC. Hệ thống lưu trữ PDF dưới dạng từng trang (page-based images) và tổ chức nội dung thành hai danh mục chính: Sách học (có/không có listening) và Bài test. Giao diện được thiết kế tối giản, dễ sử dụng.

## Glossary

- **Learning Platform**: Hệ thống nền tảng học tập miễn phí
- **User**: Người dùng của hệ thống (học viên học TOEIC)
- **Book**: Đầu sách TOEIC được lưu trữ trong hệ thống
- **Book with Listening**: Sách có kèm file audio cho phần listening
- **Book without Listening**: Sách chỉ có nội dung reading/grammar
- **Test**: Bài test TOEIC độc lập, không thuộc sách
- **Page**: Một trang của PDF được lưu dưới dạng hình ảnh
- **Audio File**: File âm thanh được lưu trong database, đi kèm với sách có listening
- **Category**: Danh mục phân loại (Sách hoặc Test)
- **Web Application**: Ứng dụng web responsive (không bao gồm mobile app native)

## Requirements

### Requirement 1: Homepage and Category Display

**User Story:** As a learner, I want to see all available books and tests organized by category when I first visit the platform, so that I can easily find what I need

#### Acceptance Criteria

1. WHEN a user visits the homepage, THE Learning Platform SHALL display two main categories: Books and Tests
2. THE Learning Platform SHALL display all available books with thumbnail images and titles
3. THE Learning Platform SHALL indicate which books have listening audio with a visual badge or icon
4. THE Learning Platform SHALL display all available tests as a separate list from books
5. THE Learning Platform SHALL provide a simple and clean interface without complex navigation

### Requirement 2: Book and Test Storage

**User Story:** As a system administrator, I want to store PDF content as individual page images and audio files in the database, so that all content can be retrieved efficiently

#### Acceptance Criteria

1. THE Learning Platform SHALL store each PDF page as a separate image file (BLOB) in the database
2. THE Learning Platform SHALL store audio files as binary data (BLOB) in the database
3. THE Learning Platform SHALL maintain page order metadata for each book or test
4. THE Learning Platform SHALL associate audio files with books that have listening content
5. THE Learning Platform SHALL store book metadata including title, type (with/without listening), total pages, and audio file references

### Requirement 3: PDF Import and Processing

**User Story:** As a system administrator, I want to import PDF files and automatically convert them into page images stored in the database, so that I can easily add new books and tests

#### Acceptance Criteria

1. THE Learning Platform SHALL provide an API endpoint to accept PDF file uploads
2. WHEN a PDF is uploaded, THE Learning Platform SHALL convert each page to an image format (PNG or JPEG)
3. THE Learning Platform SHALL automatically store each converted page image in the database with proper ordering
4. THE Learning Platform SHALL accept audio file uploads and associate them with the corresponding book
5. THE Learning Platform SHALL provide a simple admin interface or API for bulk importing multiple PDFs

### Requirement 4: Book Viewing and Navigation

**User Story:** As a learner, I want to view book pages sequentially and navigate between them, so that I can read through the content like a real book

#### Acceptance Criteria

1. WHEN a user selects a book, THE Learning Platform SHALL display the first page as an image
2. THE Learning Platform SHALL provide next and previous buttons to navigate between pages
3. THE Learning Platform SHALL display current page number and total pages
4. THE Learning Platform SHALL allow users to jump to a specific page number
5. THE Learning Platform SHALL remember the last viewed page when a user returns to a book

### Requirement 5: Listening Audio Playback

**User Story:** As a learner, I want to play audio files while viewing books with listening content, so that I can practice listening exercises

#### Acceptance Criteria

1. WHERE a book has listening content, THE Learning Platform SHALL display an audio player interface
2. THE Learning Platform SHALL provide play, pause, and stop controls for audio playback
3. THE Learning Platform SHALL display audio progress with a seekable timeline
4. THE Learning Platform SHALL allow users to adjust volume
5. THE Learning Platform SHALL continue playing audio while navigating between pages

### Requirement 6: Test Viewing and Navigation

**User Story:** As a learner, I want to view and navigate through test pages, so that I can practice TOEIC tests

#### Acceptance Criteria

1. WHEN a user selects a test, THE Learning Platform SHALL display the first page as an image
2. THE Learning Platform SHALL provide the same navigation controls as book viewing
3. THE Learning Platform SHALL display current page number and total pages
4. THE Learning Platform SHALL allow users to jump to specific page numbers
5. THE Learning Platform SHALL remember the last viewed page when a user returns to a test

### Requirement 7: Simple User Progress Tracking

**User Story:** As a learner, I want the system to remember which page I was on, so that I can continue where I left off

#### Acceptance Criteria

1. WHEN a user views a page, THE Learning Platform SHALL save the current page position
2. WHEN a user returns to a book or test, THE Learning Platform SHALL open to the last viewed page
3. THE Learning Platform SHALL track progress separately for each book and test
4. THE Learning Platform SHALL store progress data in browser local storage or database
5. THE Learning Platform SHALL display a "Continue" option on previously viewed content

### Requirement 8: Responsive Web UI

**User Story:** As a user, I want a clean and simple web interface that works on different devices, so that I can focus on learning without distractions

#### Acceptance Criteria

1. THE Learning Platform SHALL provide a minimalist web design with clear typography and spacing
2. THE Learning Platform SHALL display content in a responsive layout that adapts to desktop, tablet, and mobile screen sizes
3. THE Learning Platform SHALL optimize page images for fast loading in web browsers
4. THE Learning Platform SHALL provide clear visual distinction between books with and without listening
5. THE Learning Platform SHALL use intuitive icons and labels for all controls
