import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Book } from '../services/api';

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/book/${book.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <div className="aspect-3/4 bg-muted relative overflow-hidden">
          <img
            src={book.thumbnailUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23ddd" width="200" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary">Book</Badge>
          </div>
          {book.hasListening && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-primary text-primary-foreground">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Listening
              </Badge>
            </div>
          )}
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-base line-clamp-2 font-display">
            {book.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            {book.totalPages} trang
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default BookCard;
