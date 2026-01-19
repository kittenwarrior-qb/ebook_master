import { Link } from 'react-router-dom';
import type { Book } from '../services/api';

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  return (
    <Link
      to={`/book/${book.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
        <img
          src={book.thumbnailUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23ddd" width="200" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
        {book.hasListening && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Listening
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500">
          {book.totalPages} trang
        </p>
      </div>
    </Link>
  );
}

export default BookCard;
