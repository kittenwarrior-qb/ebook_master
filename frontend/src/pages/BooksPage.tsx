import { useState, useEffect } from 'react';
import { booksApi, type Book } from '../services/api';
import BookCard from '../components/BookCard';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Button } from '@/components/ui/button';

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const allBooks = await booksApi.getAll();
      const booksList = allBooks.filter((book) => book.category === 'book');
      setBooks(booksList);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Sách học TOEIC</h1>
        <LoadingSpinner count={8} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Sách học TOEIC</h1>
        <div className="text-center py-12 space-y-4">
          <ErrorMessage message={error} />
          <Button onClick={fetchBooks}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Sách học TOEIC</h1>
        <p className="text-muted-foreground">
          Khám phá bộ sưu tập sách học TOEIC của chúng tôi
        </p>
      </div>

      {/* Placeholder for future filter section */}
      {/* <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Filter options coming soon...</p>
        </CardContent>
      </Card> */}

      {books.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Chưa có sách nào được thêm vào.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Placeholder for pagination */}
      {/* {books.length > 0 && (
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground">Pagination coming soon...</p>
        </div>
      )} */}
    </div>
  );
}

export default BooksPage;
