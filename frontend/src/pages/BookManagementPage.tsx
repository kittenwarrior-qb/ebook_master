import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Book {
  id: number;
  title: string;
  category: string;
  hasListening: boolean;
  totalPages: number;
  thumbnailUrl: string | null;
  processingStatus: string;
  createdAt: string;
}

interface Page {
  id: number;
  bookId: number;
  pageNumber: number;
  imageUrl: string;
  cloudinaryPublicId: string;
}

export default function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editHasListening, setEditHasListening] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailUploadMode, setThumbnailUploadMode] = useState<'file' | 'url'>('file');
  const [replacePageId, setReplacePageId] = useState<number | null>(null);
  const [replaceImageFile, setReplaceImageFile] = useState<File | null>(null);
  const [replaceImageUrl, setReplaceImageUrl] = useState('');
  const [replaceUploadMode, setReplaceUploadMode] = useState<'file' | 'url'>('file');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/books?page=1&limit=100`);
      setBooks(response.data.books);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDetails = async (bookId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/books/${bookId}`);
      setSelectedBook(response.data.book);
      setPages(response.data.pages);
      setEditTitle(response.data.book.title);
      setEditCategory(response.data.book.category);
      setEditHasListening(response.data.book.hasListening);
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Không thể tải chi tiết sách');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async () => {
    if (!selectedBook) return;

    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/admin/books/${selectedBook.id}`, {
        title: editTitle,
        category: editCategory,
        hasListening: editHasListening,
      });
      setMessage('✅ Cập nhật thông tin sách thành công!');
      setEditMode(false);
      fetchBookDetails(selectedBook.id);
      fetchBooks();
    } catch (error) {
      console.error('Update error:', error);
      setError('❌ Không thể cập nhật sách');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!confirm('Bạn có chắc muốn xóa sách này? Hành động này không thể hoàn tác!')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/admin/books/${bookId}`);
      setMessage('✅ Xóa sách thành công!');
      setSelectedBook(null);
      setPages([]);
      fetchBooks();
    } catch (error) {
      console.error('Delete error:', error);
      setError('❌ Không thể xóa sách');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadThumbnail = async () => {
    if (!selectedBook) return;

    if (thumbnailUploadMode === 'file' && !thumbnailFile) {
      setError('Vui lòng chọn file ảnh');
      return;
    }

    if (thumbnailUploadMode === 'url' && !thumbnailUrl) {
      setError('Vui lòng nhập URL ảnh');
      return;
    }

    try {
      setLoading(true);

      if (thumbnailUploadMode === 'file') {
        const formData = new FormData();
        formData.append('thumbnail', thumbnailFile!);

        await axios.post(
          `${API_URL}/api/admin/books/${selectedBook.id}/thumbnail`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/api/admin/books/${selectedBook.id}/thumbnail-url`,
          { imageUrl: thumbnailUrl }
        );
      }

      setMessage('✅ Upload thumbnail thành công!');
      setThumbnailFile(null);
      setThumbnailUrl('');
      fetchBookDetails(selectedBook.id);
      fetchBooks();
    } catch (error) {
      console.error('Upload thumbnail error:', error);
      setError('❌ Không thể upload thumbnail');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPageAsThumbnail = async (pageNumber: number) => {
    if (!selectedBook) return;

    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/admin/books/${selectedBook.id}/thumbnail/page/${pageNumber}`
      );
      setMessage(`✅ Đã đặt trang ${pageNumber} làm thumbnail!`);
      fetchBookDetails(selectedBook.id);
      fetchBooks();
    } catch (error) {
      console.error('Set thumbnail error:', error);
      setError('❌ Không thể đặt trang làm thumbnail');
    } finally {
      setLoading(false);
    }
  };

  const handleReplacePage = async () => {
    if (!replacePageId) return;

    if (replaceUploadMode === 'file' && !replaceImageFile) {
      setError('Vui lòng chọn file ảnh');
      return;
    }

    if (replaceUploadMode === 'url' && !replaceImageUrl) {
      setError('Vui lòng nhập URL ảnh');
      return;
    }

    try {
      setLoading(true);

      if (replaceUploadMode === 'file') {
        const formData = new FormData();
        formData.append('image', replaceImageFile!);

        await axios.put(
          `${API_URL}/api/admin/pages/${replacePageId}/replace`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        await axios.put(
          `${API_URL}/api/admin/pages/${replacePageId}/replace-url`,
          { imageUrl: replaceImageUrl }
        );
      }

      setMessage('✅ Thay thế ảnh trang thành công!');
      setReplacePageId(null);
      setReplaceImageFile(null);
      setReplaceImageUrl('');
      if (selectedBook) {
        fetchBookDetails(selectedBook.id);
      }
    } catch (error) {
      console.error('Replace page error:', error);
      setError('❌ Không thể thay thế ảnh trang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">📚 Quản Lý Sách</h1>

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
          <button onClick={() => setMessage('')} className="float-right font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={() => setError('')} className="float-right font-bold">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Books List */}
        <div className="lg:col-span-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danh Sách Sách</h2>
          
          {loading && <p className="text-gray-500">Đang tải...</p>}
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => fetchBookDetails(book.id)}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedBook?.id === book.id ? 'bg-blue-50 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {book.thumbnailUrl && (
                    <img
                      src={book.thumbnailUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{book.title}</h3>
                    <p className="text-xs text-gray-500">
                      ID: {book.id} | {book.totalPages} trang
                    </p>
                    <p className="text-xs text-gray-500">
                      {book.category === 'book' ? '📚 Sách' : '📝 Đề thi'}
                      {book.hasListening && ' | 🎵'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2">
          {!selectedBook ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
              Chọn một cuốn sách để xem chi tiết
            </div>
          ) : (
            <div className="space-y-6">
              {/* Book Info */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold">{selectedBook.title}</h2>
                  <button
                    onClick={() => handleDeleteBook(selectedBook.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    🗑️ Xóa Sách
                  </button>
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tên Sách</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Danh Mục</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="book">Sách</option>
                        <option value="test">Đề Thi</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editHasListening}
                        onChange={(e) => setEditHasListening(e.target.checked)}
                        className="mr-2"
                      />
                      <label className="text-sm">Có file nghe</label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateBook}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        💾 Lưu
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      <strong>ID:</strong> {selectedBook.id}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Danh mục:</strong> {selectedBook.category === 'book' ? 'Sách' : 'Đề thi'}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Tổng số trang:</strong> {selectedBook.totalPages}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Có file nghe:</strong> {selectedBook.hasListening ? 'Có' : 'Không'}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <strong>Trạng thái:</strong> {selectedBook.processingStatus}
                    </p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      ✏️ Chỉnh Sửa
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail Management */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">🖼️ Quản Lý Thumbnail</h3>
                
                {selectedBook.thumbnailUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Thumbnail hiện tại:</p>
                    <img
                      src={selectedBook.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-32 h-auto border rounded"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Chọn phương thức upload
                    </label>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="file"
                          checked={thumbnailUploadMode === 'file'}
                          onChange={(e) => setThumbnailUploadMode(e.target.value as 'file' | 'url')}
                          className="mr-2"
                        />
                        Upload File
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="url"
                          checked={thumbnailUploadMode === 'url'}
                          onChange={(e) => setThumbnailUploadMode(e.target.value as 'file' | 'url')}
                          className="mr-2"
                        />
                        Từ URL
                      </label>
                    </div>

                    {thumbnailUploadMode === 'file' ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                          className="w-full p-2 border rounded"
                        />
                        {thumbnailFile && (
                          <button
                            onClick={handleUploadThumbnail}
                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            📤 Upload
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full p-2 border rounded"
                        />
                        {thumbnailUrl && (
                          <button
                            onClick={handleUploadThumbnail}
                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            📤 Upload từ URL
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Pages Grid */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">📄 Các Trang ({pages.length})</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
                  {pages.map((page) => (
                    <div key={page.id} className="border rounded p-2">
                      <img
                        src={page.imageUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="w-full h-auto mb-2 rounded"
                      />
                      <p className="text-sm font-medium text-center mb-2">
                        Trang {page.pageNumber}
                      </p>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleSetPageAsThumbnail(page.pageNumber)}
                          className="w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Đặt làm Thumbnail
                        </button>
                        <button
                          onClick={() => setReplacePageId(page.id)}
                          className="w-full text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                        >
                          Thay Thế Ảnh
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Replace Page Modal */}
              {replacePageId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-xl font-semibold mb-4">Thay Thế Ảnh Trang</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Chọn phương thức upload
                      </label>
                      <div className="flex gap-4 mb-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="file"
                            checked={replaceUploadMode === 'file'}
                            onChange={(e) => setReplaceUploadMode(e.target.value as 'file' | 'url')}
                            className="mr-2"
                          />
                          Upload File
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="url"
                            checked={replaceUploadMode === 'url'}
                            onChange={(e) => setReplaceUploadMode(e.target.value as 'file' | 'url')}
                            className="mr-2"
                          />
                          Từ URL
                        </label>
                      </div>

                      {replaceUploadMode === 'file' ? (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setReplaceImageFile(e.target.files?.[0] || null)}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <input
                          type="text"
                          value={replaceImageUrl}
                          onChange={(e) => setReplaceImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full p-2 border rounded"
                        />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleReplacePage}
                        disabled={
                          (replaceUploadMode === 'file' && !replaceImageFile) ||
                          (replaceUploadMode === 'url' && !replaceImageUrl)
                        }
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                      >
                        Thay Thế
                      </button>
                      <button
                        onClick={() => {
                          setReplacePageId(null);
                          setReplaceImageFile(null);
                          setReplaceImageUrl('');
                        }}
                        className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
