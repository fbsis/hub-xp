import React from 'react';

// Using primitive types from domain for simplicity
interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    publishedYear: number;
    description?: string;
    avgRating?: number;
    reviewCount?: number;
  };
  onClick?: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {book.title}
      </h3>
      <p className="text-gray-600 text-sm mb-1">by {book.author}</p>
      <p className="text-gray-500 text-xs mb-3">Published: {book.publishedYear}</p>
      
      {book.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {book.description}
        </p>
      )}
      
      {book.avgRating !== undefined && book.reviewCount !== undefined && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 ml-1">
              {book.avgRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
} 