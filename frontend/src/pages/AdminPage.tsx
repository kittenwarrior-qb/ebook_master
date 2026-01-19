import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ADMIN_API_KEY = '1';

interface UploadResponse {
  success: boolean;
  book_id: number;
  pages_imported: number;
  status: string;
}

interface BookStatusResponse {
  book_id: number;
  status: string;
  processed_pages: number;
  total_pages: number;
  message: string;
  progress_percentage: number;
}

interface AudioUploadResponse {
  success: boolean;
  audio_id: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_API_KEY) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('❌ Incorrect password!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">🔐 Admin Access</h1>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            {authError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {authError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 font-medium"
            >
              Authenticate
            </button>
          </form>
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
            💡 Contact administrator to get password
          </div>
        </div>
      </div>
    );
  }

  const pollBookStatus = async (bookId: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get<BookStatusResponse>(
          `${API_URL}/api/admin/book-status/${bookId}`
        );

        const { status, total_pages, message, progress_percentage } = response.data;

        setUploadProgress(progress_percentage);
        setProcessingStep(message);

        if (status === 'completed') {
          clearInterval(pollInterval);
          setMessage(
            `✅ Upload successful! Book ID: ${bookId}, Pages: ${total_pages}`
          );
          setUploading(false);
          setTimeout(() => {
            setProcessingStep('');
            setUploadProgress(0);
          }, 3000);
        } else if (status === 'failed') {
          clearInterval(pollInterval);
          setError(`❌ Processing error: ${message}`);
          setUploading(false);
          setProcessingStep('');
          setUploadProgress(0);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000); // Poll every 2 seconds
  };

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile || !title) {
      setError('Please select a PDF file and enter book title');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');
    setUploadProgress(0);
    setProcessingStep('Preparing upload...');

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('hasListening', hasListening.toString());

      setProcessingStep('📤 Uploading PDF file to server...');

      const response = await axios.post<UploadResponse>(
        `${API_URL}/api/admin/upload-book`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
              if (percentCompleted < 100) {
                setProcessingStep(`📤 Uploading: ${percentCompleted}%`);
              } else {
                setProcessingStep('⚙️ Processing PDF and converting to images...');
              }
            }
          },
        }
      );

      setProcessingStep('⚙️ Processing PDF and converting to images...');
      setUploadProgress(100);

      // Start polling for status
      pollBookStatus(response.data.book_id);

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
      setProcessingStep('');
      setError(
        `❌ Error: ${error.response?.data?.message || error.message || 'Unknown error'}`
      );
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAudioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile || !bookIdForAudio) {
      setError('Please select audio file and enter Book ID');
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
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(
        `✅ Audio upload successful! Audio ID: ${response.data.audio_id}`
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
        `❌ Error: ${error.response?.data?.message || error.message || 'Unknown error'}`
      );
    } finally {
      setUploadingAudio(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel - Upload Books</h1>
        <a
          href="/admin/books"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          📚 Manage Books
        </a>
      </div>

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

      {/* Progress Bar */}
      {uploading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700">{processingStep}</span>
            <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300 flex items-center justify-center"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress > 10 && (
                <span className="text-xs text-white font-semibold">{uploadProgress}%</span>
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {uploadProgress < 100 ? (
              <p>⏳ Please wait, processing file...</p>
            ) : (
              <p>⚙️ Processing PDF, may take a few minutes...</p>
            )}
          </div>
        </div>
      )}

      {/* Upload PDF Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">📚 Upload PDF</h2>
        <form onSubmit={handlePdfUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              PDF File *
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
                Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Book Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hackers TOEIC Reading"
              className="w-full p-2 border border-gray-300 rounded"
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'book' | 'test')}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={uploading}
            >
              <option value="book">Book</option>
              <option value="test">Test</option>
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
              Has listening audio file
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || !pdfFile || !title}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Note:</strong> Upload and PDF conversion may take 10-20 minutes for large files (500+ pages).
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
              placeholder="e.g. 1"
              className="w-full p-2 border border-gray-300 rounded"
              disabled={uploadingAudio}
            />
            <p className="text-sm text-gray-600 mt-1">
              Enter Book ID from PDF upload result above
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Audio File * (MP3, WAV, OGG)
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
                Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploadingAudio || !audioFile || !bookIdForAudio}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadingAudio ? 'Uploading...' : 'Upload Audio'}
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">📖 User Guide</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Select PDF file to upload (max few hundred MB)</li>
          <li>Enter book title and select category</li>
          <li>If book has audio file, check "Has listening audio file"</li>
          <li>Click "Upload PDF" and wait for completion</li>
          <li>After PDF upload succeeds, copy Book ID</li>
          <li>If there's audio, select audio file and enter Book ID</li>
          <li>Click "Upload Audio" to upload audio file</li>
          <li>Return to home page to view uploaded book</li>
        </ol>
      </div>

      {/* API Info */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">🔧 Technical Information</h3>
        <div className="space-y-2 text-sm font-mono">
          <p><strong>API URL:</strong> {API_URL}</p>
          <p><strong>Admin Key:</strong> {ADMIN_API_KEY.substring(0, 20)}...</p>
          <p><strong>Swagger Docs:</strong> <a href={`${API_URL}/api`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{API_URL}/api</a></p>
        </div>
      </div>
    </div>
  );
}
