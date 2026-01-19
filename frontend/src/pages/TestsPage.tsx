import { useState, useEffect } from 'react';
import { booksApi, type Book } from '../services/api';
import BookCard from '../components/BookCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Bài test TOEIC</h1>
        <LoadingSpinner count={8} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Bài test TOEIC</h1>
        <div className="text-center py-12 space-y-4">
          <ErrorMessage message={error} />
          <Button onClick={fetchTests}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Bài test TOEIC</h1>
        <p className="text-muted-foreground">
          Luyện tập với các bài test TOEIC chất lượng cao
        </p>
      </div>

      {/* Test Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê</CardTitle>
          <CardDescription>Tổng quan về các bài test có sẵn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{tests.length}</p>
              <p className="text-sm text-muted-foreground">Tổng số bài test</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">
                {tests.filter(t => t.hasListening).length}
              </p>
              <p className="text-sm text-muted-foreground">Có phần Listening</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">
                {tests.reduce((sum, t) => sum + t.totalPages, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Tổng số trang</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future filter section */}
      {/* <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Filter by difficulty and duration coming soon...</p>
        </CardContent>
      </Card> */}

      {tests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Chưa có bài test nào được thêm vào.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tests.map((test) => (
            <BookCard key={test.id} book={test} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TestsPage;
