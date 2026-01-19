import { useState, useEffect } from 'react';
import { booksApi, Book } from '../services/api';
import BookCard from '../components/BookCard';

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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchBooks}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Books Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Sách học TOEIC
        </h2>
        {books.length === 0 ? (
          <p className="text-gray-500">Chưa có sách nào được thêm vào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Tests Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Bài test TOEIC
        </h2>
        {tests.length === 0 ? (
          <p className="text-gray-500">Chưa có bài test nào được thêm vào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tests.map((test) => (
              <BookCard key={test.id} book={test} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
