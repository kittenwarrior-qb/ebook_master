import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksApi, pagesApi, progressApi, Book } from '../services/api';
import AudioPlayer from '../components/AudioPlayer';

function BookViewer() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState('1');

  // Fetch book details and progress
  useEffect(() => {
    if (!bookId) return;

    const fetchBookData = async () => {
      try {
        setLoading(true);
        const bookData = await booksApi.getById(parseInt(bookId));
        setBook(bookData);

        // Load progress
        const progress = await progressApi.getProgress(parseInt(bookId));
        const startPage = progress.last_page_number || 1;
        setCurrentPage(startPage);
        setPageInput(startPage.toString());
        
        setError(null);
      } catch (err) {
        setError('Failed to load book. Please try again.');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId]);

  // Save progress when page changes
  useEffect(() => {
    if (!bookId || !book) return;

    const saveProgress = async () => {
      try {
        await progressApi.saveProgress(parseInt(bookId), currentPage);
      } catch (err) {
        console.error('Error saving progress:', err);
      }
    };

    const debounceTimer = setTimeout(saveProgress, 1000);
    return () => clearTimeout(debounceTimer);
  }, [bookId, currentPage, book]);

  // Preload adjacent pages
  useEffect(() => {
    if (!book || !bookId) return;

    const preloadImage = (pageNum: number) => {
      if (pageNum < 1 || pageNum > book.totalPages) return;
      const img = new Image();
      img.src = pagesApi.getPageImage(parseInt(bookId), pageNum);
    };

    // Preload next and previous pages
    if (currentPage < book.totalPages) {
      preloadImage(currentPage + 1);
    }
    if (currentPage > 1) {
      preloadImage(currentPage - 1);
    }
  }, [currentPage, book, bookId]);

  const goToPage = useCallback((pageNum: number) => {
    if (!book) return;
    if (pageNum < 1 || pageNum > book.totalPages) return;
    
    setImageLoading(true);
    setCurrentPage(pageNum);
    setPageInput(pageNum.toString());
  }, [book]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (book && currentPage < book.totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum)) {
      goToPage(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  }, [currentPage, book]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Book not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
      </div>

      {/* Audio Player */}
      {book.hasListening && bookId && (
        <div className="mb-6">
          <AudioPlayer bookId={parseInt(bookId)} />
        </div>
      )}

      {/* Navigation Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
            <span className="text-gray-600">Page</span>
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              className="w-20 px-3 py-2 border border-gray-300 rounded text-center"
              min={1}
              max={book.totalPages}
            />
            <span className="text-gray-600">of {book.totalPages}</span>
          </form>

          <button
            onClick={handleNext}
            disabled={currentPage === book.totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Page Display */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          <img
            src={pagesApi.getPageImage(parseInt(bookId), currentPage)}
            alt={`Page ${currentPage}`}
            className="w-full h-auto"
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              setImageLoading(false);
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"%3E%3Crect fill="%23ddd" width="800" height="1000"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EFailed to load page%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Use arrow keys (← →) to navigate between pages
      </div>
    </div>
  );
}

export default BookViewer;
