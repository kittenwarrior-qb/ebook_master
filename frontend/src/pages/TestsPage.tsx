import { useState, useEffect } from 'react';
import { booksApi, type Book } from '../services/api';
import BookCard from '../components/BookCard';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Button } from '@/components/ui/button';

function TestsPage() {
  const [tests, setTests] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const allBooks = await booksApi.getAll();
      const testsList = allBooks.filter((book) => book.category === 'test');
      setTests(testsList);
      setError(null);
    } catch (err) {
      setError('Failed to load tests. Please try again later.');
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold">TOEIC Tests</h1>
        <LoadingSpinner count={8} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold">TOEIC Tests</h1>
        <div className="text-center py-12 space-y-4">
          <ErrorMessage message={error} />
          <Button onClick={fetchTests}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 md:mb-2">Practice Tests</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Practice with high-quality test materials
        </p>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-4 md:pt-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary">{tests.length}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Total Tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {tests.filter(t => t.hasListening).length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">With Listening</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {tests.reduce((sum, t) => sum + t.totalPages, 0)}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Total Pages</p>
          </CardContent>
        </Card>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            No tests have been added yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {tests.map((test) => (
            <BookCard key={test.id} book={test} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TestsPage;
