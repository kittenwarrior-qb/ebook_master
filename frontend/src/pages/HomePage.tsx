import { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Button } from '@/components/ui/button';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
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
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <Card className="border-none shadow-none bg-linear-to-r from-primary/10 to-primary/5">
        <CardHeader className="text-center space-y-2 py-8 md:py-12">
          <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-display">
            Welcome to Ebook Master
          </CardTitle>
          <CardDescription className="text-base md:text-lg max-w-2xl mx-auto">
            Your comprehensive digital library for learning and growth
          </CardDescription>
        </CardHeader>
      </Card>

     </div>
  );
}

export default HomePage;
