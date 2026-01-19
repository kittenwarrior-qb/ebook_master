import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksApi, pagesApi, progressApi, type Book } from '../services/api';
import AudioPlayer from '../components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

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
  }, [handlePrevious, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-150">
        <LoadingSpinner count={1} />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-12 space-y-4">
        <ErrorMessage message={error || 'Book not found'} />
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-display font-bold">{book.title}</h1>
      </div>

      {/* Audio Player */}
      {book.hasListening && bookId && (
        <Card>
          <CardContent className="pt-6">
            <AudioPlayer bookId={parseInt(bookId)} />
          </CardContent>
        </Card>
      )}

      {/* Navigation Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              variant="outline"
              size="lg"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Page</span>
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                className="w-20 px-3 py-2 border border-input rounded-md text-center bg-background"
                min={1}
                max={book.totalPages}
              />
              <span className="text-sm text-muted-foreground">of {book.totalPages}</span>
            </form>

            <Button
              onClick={handleNext}
              disabled={currentPage === book.totalPages}
              variant="outline"
              size="lg"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Page Display */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <LoadingSpinner count={1} />
              </div>
            )}
            <img
              src={pagesApi.getPageImage(parseInt(bookId!), currentPage)}
              alt={`Page ${currentPage}`}
              className="w-full h-auto rounded-md"
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                setImageLoading(false);
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"%3E%3Crect fill="%23ddd" width="800" height="1000"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EFailed to load page%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Keyboard shortcuts hint */}
      <p className="text-center text-sm text-muted-foreground">
        Use arrow keys (← →) to navigate between pages
      </p>
    </div>
  );
}

export default BookViewer;
