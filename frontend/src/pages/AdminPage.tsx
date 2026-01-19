import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ADMIN_API_KEY = 'toeic_master_admin_2024_secure_key_xyz789';

interface UploadResponse {
  success: boolean;
  book_id: number;
  pages_imported: number;
}

interface AudioUploadResponse {
  success: boolean;
  audio_id: number;
}

export default function AdminPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'book' | 'test'>('book');
  const [hasListening, setHasListening] = useState(false);
  const [bookIdForAudio, setBookIdForAudio] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile || !title) {
      setError('Vui lòng chọn file PDF và nhập tên sách');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('hasListening', hasListening.toString());

      const response = await axios.post<UploadResponse>(
        `${API_URL}/api/admin/upload-book`,
        formData,
        {
          headers: {
            'x-api-key': ADMIN_API_KEY,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setMessage(`Đang upload: ${percentCompleted}%`);
            }
          },
        }
      );

      setMessage(
        `✅ Upload thành công! Book ID: ${response.data.book_id}, Số trang: ${response.data.pages_imported}`
      );
      
      // Reset form
      setPdfFile(null);
      setTitle('');
      setCategory('book');
      setHasListening(false);
      
      // Reset file input
      const fileInput = document.getElementById('pdf-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        `❌ Lỗi: ${error.response?.data?.message || error.message || 'Unknown error'}`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAudioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile || !bookIdForAudio) {
      setError('Vui lòng chọn file audio và nhập Book ID');
      return;
    }

    setUploadingAudio(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('book_id', bookIdForAudio);

      const response = await axios.post<AudioUploadResponse>(
        `${API_URL}/api/admin/upload-audio`,
        formData,
        {
          headers: {
            'x-api-key': ADMIN_API_KEY,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(
        `✅ Upload audio thành công! Audio ID: ${response.data.audio_id}`
      );
      
      // Reset form
      setAudioFile(null);
      setBookIdForAudio('');
      
      // Reset file input
      const fileInput = document.getElementById('audio-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        `❌ Lỗi: ${error.response?.data?.message || error.message || 'Unknown error'}`
      );
    } finally {
      setUploadingAudio(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Panel - Upload Sách</h1>

      {/* Messages */}
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload PDF Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">📚 Upload PDF</h2>
        <form onSubmit={handlePdfUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              File PDF *
            </label>
            <input
              id="pdf-input"
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={uploading}
            />
            {pdfFile && (
              <p className="text-sm text-gray-600 mt-1">
                Đã chọn: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tên Sách *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Hackers TOEIC Reading"
              className="w-full p-2 border border-gray-300 rounded"
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Danh Mục *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'book' | 'test')}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={uploading}
            >
              <option value="book">Sách (Book)</option>
              <option value="test">Đề Thi (Test)</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasListening"
              checked={hasListening}
              onChange={(e) => setHasListening(e.target.checked)}
              className="mr-2"
              disabled={uploading}
            />
            <label htmlFor="hasListening" className="text-sm font-medium">
              Có file nghe (Listening)
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || !pdfFile || !title}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Đang upload...' : 'Upload PDF'}
          </button>
        </form>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Lưu ý:</strong> Quá trình upload và chuyển đổi PDF có thể mất 10-20 phút cho file lớn (500+ trang).
          </p>
        </div>
      </div>

      {/* Upload Audio Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">🎵 Upload Audio</h2>
        <form onSubmit={handleAudioUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Book ID *
            </label>
            <input
              type="number"
              value={bookIdForAudio}
              onChange={(e) => setBookIdForAudio(e.target.value)}
              placeholder="VD: 1"
              className="w-full p-2 border border-gray-300 rounded"
              disabled={uploadingAudio}
            />
            <p className="text-sm text-gray-600 mt-1">
              Nhập Book ID từ kết quả upload PDF ở trên
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              File Audio * (MP3, WAV, OGG)
            </label>
            <input
              id="audio-input"
              type="file"
              accept=".mp3,.wav,.ogg,audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={uploadingAudio}
            />
            {audioFile && (
              <p className="text-sm text-gray-600 mt-1">
                Đã chọn: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploadingAudio || !audioFile || !bookIdForAudio}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadingAudio ? 'Đang upload...' : 'Upload Audio'}
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">📖 Hướng Dẫn Sử Dụng</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Chọn file PDF cần upload (tối đa vài trăm MB)</li>
          <li>Nhập tên sách và chọn danh mục</li>
          <li>Nếu sách có file nghe, tick vào "Có file nghe"</li>
          <li>Click "Upload PDF" và đợi quá trình hoàn tất</li>
          <li>Sau khi upload PDF thành công, copy Book ID</li>
          <li>Nếu có audio, chọn file audio và nhập Book ID</li>
          <li>Click "Upload Audio" để upload file nghe</li>
          <li>Quay về trang chủ để xem sách đã upload</li>
        </ol>
      </div>

      {/* API Info */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">🔧 Thông Tin Kỹ Thuật</h3>
        <div className="space-y-2 text-sm font-mono">
          <p><strong>API URL:</strong> {API_URL}</p>
          <p><strong>Admin Key:</strong> {ADMIN_API_KEY.substring(0, 20)}...</p>
          <p><strong>Swagger Docs:</strong> <a href={`${API_URL}/api`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{API_URL}/api</a></p>
        </div>
      </div>
    </div>
  );
}
