import Link from "next/link";
import { BookWithStats } from "@/types/api";

interface BookCardProps {
  book: BookWithStats;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
            <p className="text-gray-500 text-xs">Published: {book.publishedYear}</p>
          </div>
        </div>
        
        {book.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {book.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.floor(book.avgRating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {book.avgRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {book.reviewCount} review{book.reviewCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
} 