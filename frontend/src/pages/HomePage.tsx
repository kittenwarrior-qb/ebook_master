import { useState, useEffect } from 'react';
import { booksApi, type Book } from '../services/api';
import BookCard from '../components/BookCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Button } from '@/components/ui/button';

function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [tests, setTests] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const allBooks = await booksApi.getAll();
      
      // Separate books and tests
      const booksList = allBooks.filter((book) => book.category === 'book');
      const testsList = allBooks.filter((book) => book.category === 'test');
      
      setBooks(booksList);
      setTests(testsList);
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
        <LoadingSpinner count={4} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <ErrorMessage message={error} />
        <Button onClick={fetchBooks}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="border-none shadow-none bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-display">
            Welcome to TOEIC Learning Platform
          </CardTitle>
          <CardDescription className="text-lg">
            Master English with our comprehensive collection of books and practice tests
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="books">
            Sách học ({books.length})
          </TabsTrigger>
          <TabsTrigger value="tests">
            Bài test ({tests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="mt-6">
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
        </TabsContent>

        <TabsContent value="tests" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HomePage;
