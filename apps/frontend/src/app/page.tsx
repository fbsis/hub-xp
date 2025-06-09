"use client";

import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@components/ui";
import Link from "next/link";

interface BookWithStats {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedYear: number;
  description?: string;
  avgRating?: number;
  reviewCount: number;
}

async function fetchTopBooks(): Promise<BookWithStats[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const response = await fetch(`${API_URL}/books/top?limit=6`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  
  return response.json();
}

export default function HomePage() {
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ["top-books"],
    queryFn: fetchTopBooks,
  });

  return (
    <div className="p-5">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold m-0 mb-4">📚 Book Reviews</h1>
        <p className="text-lg text-gray-600 m-0 mb-5">
          Discover and review amazing books
        </p>
        <div className="flex gap-3 justify-center">
          <Link 
            href="/books"
            className="bg-blue-600 text-white px-6 py-3 no-underline rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Books
          </Link>
          <Link 
            href="/books/new"
            className="bg-green-600 text-white px-6 py-3 no-underline rounded-md text-base font-medium hover:bg-green-700 transition-colors"
          >
            Add New Book
          </Link>
        </div>
      </div>

      {/* Top Rated Books Section */}
      <div className="mb-10">
        <h2 className="mb-5 text-2xl font-semibold">⭐ Top Rated Books</h2>
        
        {isLoading && (
          <div className="text-center py-10">
            <div className="text-gray-600">Loading top books...</div>
          </div>
        )}

        {error && (
          <div className="text-red-600 p-5 bg-red-50 rounded-md border border-red-200">
            Error loading books: {error.message}
          </div>
        )}

        {!isLoading && !error && books.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            No books available yet. Be the first to add one!
          </div>
        )}

        {!isLoading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!isLoading && !error && books.length > 0 && (
        <div className="text-center mt-10">
          <Link 
            href="/books"
            className="text-blue-600 no-underline text-base hover:text-blue-800 transition-colors"
          >
            View all books →
          </Link>
        </div>
      )}
    </div>
  );
}
