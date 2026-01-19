# 📖 Hướng Dẫn Sử Dụng TOEIC Master

## 🚀 Khởi Động Hệ Thống

### 1. Chuẩn Bị

**Yêu cầu:**
- Node.js 20+
- PostgreSQL (hoặc Supabase)
- GraphicsMagick (cho pdf2pic)
- Tài khoản Cloudinary (miễn phí)

**Cài đặt GraphicsMagick (Windows):**
```bash
# Dùng Chocolatey
choco install graphicsmagick

# Hoặc download từ:
# http://www.graphicsmagick.org/download.html
```

### 2. Cấu Hình Backend

**Bước 1: Cài đặt dependencies**
```bash
cd backend
npm install
```

**Bước 2: Cấu hình .env**
```bash
# Copy từ .env.example
cp .env.example .env

# Chỉnh sửa backend/.env
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=5432
DB_USERNAME=postgres.hzgiyfaauxyuredwwrli
DB_PASSWORD=your_password
DB_DATABASE=postgres

PORT=3001
NODE_ENV=development

ADMIN_API_KEY=toeic_master_admin_2024_secure_key_xyz789

# Cloudinary (đăng ký tại https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
```

**Bước 3: Chạy migration database**
```bash
# Kết nối vào Supabase SQL Editor
# Copy và chạy nội dung file: backend/migrations/update-pages-to-cloudinary.sql
```

**Bước 4: Khởi động backend**
```bash
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`
Swagger docs: `http://localhost:3001/api`

### 3. Cấu Hình Frontend

**Bước 1: Cài đặt dependencies**
```bash
cd frontend
npm install
```

**Bước 2: Cấu hình .env**
```bash
# Tạo file frontend/.env
VITE_API_URL=http://localhost:3001
```

**Bước 3: Khởi động frontend**
```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 📚 Sử Dụng Hệ Thống

### A. Upload Sách (Admin)

**Bước 1: Truy cập trang Admin**
```
http://localhost:5173/admin
```

**Bước 2: Upload PDF**
1. Click "Chọn file" và chọn file PDF
2. Nhập tên sách (VD: "Hackers TOEIC Reading")
3. Chọn danh mục:
   - **Book**: Sách học
   - **Test**: Đề thi
4. Tick "Có file nghe" nếu sách có audio
5. Click "Upload PDF"
6. Đợi quá trình hoàn tất (10-20 phút cho 500 trang)
7. Copy **Book ID** từ thông báo thành công

**Bước 3: Upload Audio (nếu có)**
1. Nhập Book ID vừa copy
2. Chọn file audio (MP3, WAV, OGG)
3. Click "Upload Audio"

### B. Xem Sách (User)

**Bước 1: Truy cập trang chủ**
```
http://localhost:5173
```

**Bước 2: Chọn sách**
- Xem danh sách sách đã upload
- Click vào sách để đọc

**Bước 3: Đọc sách**
- Dùng nút "◀ Trang trước" / "Trang sau ▶" để chuyển trang
- Hoặc nhập số trang trực tiếp
- Nếu có audio, click nút play để nghe

**Tính năng tự động:**
- ✅ Tự động lưu tiến độ đọc
- ✅ Quay lại sẽ mở trang đã đọc
- ✅ Cache ảnh để load nhanh hơn

## 🔧 Test API Qua Swagger

### 1. Truy cập Swagger UI
```
http://localhost:3001/api
```

### 2. Authorize
1. Click nút "Authorize" 🔓
2. Nhập admin key: `toeic_master_admin_2024_secure_key_xyz789`
3. Click "Authorize"

### 3. Test Upload PDF
1. Mở endpoint: `POST /api/admin/upload-book`
2. Click "Try it out"
3. Upload file và điền thông tin
4. Click "Execute"

### 4. Test Các Endpoint Khác

**Lấy danh sách sách:**
```
GET /api/books
```

**Lấy thông tin sách:**
```
GET /api/books/1
```

**Xem trang sách:**
```
GET /api/books/1/pages/1
```

**Lấy audio:**
```
GET /api/books/1/audio
```

**Lưu tiến độ:**
```
POST /api/progress/1
Body: { "page_number": 15 }
```

## 🧪 Test Bằng cURL

### Upload PDF
```bash
curl -X POST "http://localhost:3001/api/admin/upload-book" \
  -H "x-api-key: toeic_master_admin_2024_secure_key_xyz789" \
  -F "pdf=@/path/to/book.pdf" \
  -F "title=Hackers TOEIC Reading" \
  -F "category=book" \
  -F "hasListening=true"
```

### Upload Audio
```bash
curl -X POST "http://localhost:3001/api/admin/upload-audio" \
  -H "x-api-key: toeic_master_admin_2024_secure_key_xyz789" \
  -F "audio=@/path/to/audio.mp3" \
  -F "book_id=1"
```

### Lấy danh sách sách
```bash
curl http://localhost:3001/api/books
```

### Xem trang sách
```bash
curl http://localhost:3001/api/books/1/pages/1
# Sẽ redirect đến Cloudinary URL
```

## 📊 Kiểm Tra Database

### Kết nối vào Supabase
```bash
psql -h aws-1-ap-southeast-1.pooler.supabase.com \
     -U postgres.hzgiyfaauxyuredwwrli \
     -d postgres
```

### Các Query Hữu Ích

**Xem danh sách sách:**
```sql
SELECT id, title, category, total_pages, has_listening 
FROM books 
ORDER BY created_at DESC;
```

**Đếm số trang đã import:**
```sql
SELECT book_id, COUNT(*) as total_pages 
FROM pages 
GROUP BY book_id;
```

**Xem URL ảnh:**
```sql
SELECT page_number, image_url 
FROM pages 
WHERE book_id = 1 
ORDER BY page_number 
LIMIT 5;
```

**Xem tiến độ đọc:**
```sql
SELECT * FROM user_progress 
ORDER BY last_accessed_at DESC;
```

## 🎯 Workflow Hoàn Chỉnh

### Scenario: Upload sách "Hackers TOEIC Reading"

**1. Chuẩn bị:**
- File PDF: `hackers-toeic-reading.pdf` (520 trang)
- File Audio: `hackers-toeic-reading.mp3` (2 giờ)

**2. Upload PDF:**
```bash
# Qua frontend
http://localhost:5173/admin
→ Chọn file PDF
→ Title: "Hackers TOEIC Reading"
→ Category: "book"
→ Has Listening: ✓
→ Upload PDF
→ Đợi 15 phút
→ Kết quả: Book ID = 1, Pages = 520
```

**3. Upload Audio:**
```bash
→ Book ID: 1
→ Chọn file audio
→ Upload Audio
→ Kết quả: Audio ID = 1
```

**4. Kiểm tra:**
```bash
# Xem sách trên trang chủ
http://localhost:5173

# Click vào sách
http://localhost:5173/book/1

# Đọc và nghe
→ Trang 1 hiển thị
→ Audio player hiển thị
→ Chuyển trang → tiến độ tự động lưu
```

## ⚠️ Xử Lý Lỗi Thường Gặp

### 1. "Cannot find module 'C:\...\backend\dist\main'"
```bash
# Rebuild backend
cd backend
npm run build
npm run dev
```

### 2. "Invalid or missing API key"
```bash
# Kiểm tra admin key trong .env
# Đảm bảo khớp với key trong frontend/src/pages/AdminPage.tsx
```

### 3. "GraphicsMagick not found"
```bash
# Cài đặt GraphicsMagick
choco install graphicsmagick

# Hoặc download từ:
http://www.graphicsmagick.org/download.html
```

### 4. "Upload failed" / "Cloudinary error"
```bash
# Kiểm tra Cloudinary credentials trong .env
# Đảm bảo đã đăng ký tài khoản Cloudinary
# Kiểm tra internet connection
```

### 5. "Database connection failed"
```bash
# Kiểm tra Supabase credentials
# Kiểm tra IP có được whitelist trong Supabase không
# Test connection:
psql -h aws-1-ap-southeast-1.pooler.supabase.com -U postgres.hzgiyfaauxyuredwwrli -d postgres
```

### 6. Frontend không kết nối được backend
```bash
# Kiểm tra CORS trong backend/src/main.ts
# Kiểm tra VITE_API_URL trong frontend/.env
# Đảm bảo backend đang chạy tại port 3001
```

## 📈 Giới Hạn & Tối Ưu

### Cloudinary Free Tier:
- ✅ Storage: 25 GB (đủ cho ~8,000 trang)
- ✅ Bandwidth: 25 GB/tháng
- ✅ Transformations: 25,000/tháng

### Supabase Free Tier:
- ✅ Database: 500 MB (chỉ lưu metadata)
- ✅ Bandwidth: 5 GB/tháng

### Tối Ưu Hóa:
```typescript
// Giảm chất lượng ảnh nếu cần
const options = {
  density: 100,  // Thay vì 150
  width: 800,    // Thay vì 1200
  height: 1066,  // Thay vì 1600
};
```

## 🔐 Bảo Mật

### Production Checklist:
- [ ] Đổi ADMIN_API_KEY thành key phức tạp
- [ ] Thêm authentication cho user
- [ ] Enable HTTPS
- [ ] Giới hạn rate limiting
- [ ] Validate file size và type
- [ ] Scan virus cho uploaded files
- [ ] Backup database định kỳ

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong terminal
2. Xem Swagger docs: http://localhost:3001/api
3. Kiểm tra database trong Supabase
4. Xem Cloudinary Media Library
5. Đọc file CLOUDINARY_SETUP.md
