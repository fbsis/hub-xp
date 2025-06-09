"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, BookCard } from "@components/ui";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedYear: number;
  description?: string;
  createdAt: string;
}

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

// API function to fetch all books
async function fetchAllBooks(): Promise<Book[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const response = await fetch(`${API_URL}/books`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  
  const data = await response.json();
  return data.books || [];
}

// API function to fetch top books
async function fetchTopBooks(): Promise<BookWithStats[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const response = await fetch(`${API_URL}/books/top?limit=20`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch top books");
  }
  
  return response.json();
}

export default function BooksPage() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  
  const { data: allBooks = [], isLoading: loadingAll, error: errorAll } = useQuery({
    queryKey: ["all-books"],
    queryFn: fetchAllBooks,
  });

  const { data: topBooks = [], isLoading: loadingTop, error: errorTop } = useQuery({
    queryKey: ["top-books"],
    queryFn: fetchTopBooks,
  });

  // Handle book click to add review
  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}/review`);
  };

  // Top Books View Component
  const TopBooksView = () => {
    if (loadingTop) {
      return (
        <div className="text-center py-10">
          <div className="text-gray-600">Loading top rated books...</div>
        </div>
      );
    }

    if (errorTop) {
      return (
        <div className="text-red-600 p-5 bg-red-50 rounded-md border border-red-200">
          Error loading top books: {errorTop.message}
        </div>
      );
    }

    if (topBooks.length === 0) {
      return (
        <div className="text-center py-10 text-gray-600">
          No rated books yet. Add some reviews to see top books!
        </div>
      );
    }

    return (
      <div>
        <div className="mb-5 p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">
          <p className="m-0 text-blue-700 font-medium">
            ⭐ These are the highest rated books. Click on any book to add your review!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topBooks.map((book) => (
            <div
              key={book._id}
              onClick={() => handleBookClick(book._id)}
              className="cursor-pointer"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // All Books View Component
  const AllBooksView = () => {
    if (loadingAll) {
      return (
        <div className="text-center py-10">
          <div className="text-gray-600">Loading all books...</div>
        </div>
      );
    }

    if (errorAll) {
      return (
        <div className="text-red-600 p-5 bg-red-50 rounded-md border border-red-200">
          Error loading books: {errorAll.message}
        </div>
      );
    }

    if (allBooks.length === 0) {
      return (
        <div className="text-center py-10 text-gray-600">
          No books available yet. Be the first to add one!
        </div>
      );
    }

    return (
      <div>
        <div className="mb-5 p-4 bg-blue-50 rounded-md border-l-4 border-green-500">
          <p className="m-0 text-green-700 font-medium">
            📚 All books in the library. Click on any book to add your review!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allBooks.map((book) => (
            <div
              key={book._id}
              onClick={() => handleBookClick(book._id)}
              className="cursor-pointer"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tab items
  const tabItems = [
    {
      key: 'top',
      label: '⭐ Top Rated Books',
      content: <TopBooksView />
    },
    {
      key: 'all',
      label: '📚 All Books',
      content: <AllBooksView />
    }
  ];

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="m-0 mb-2 text-3xl font-bold">📖 Book Reviews</h1>
          <p className="m-0 text-gray-600 text-base">
            Discover great books and share your thoughts
          </p>
        </div>
        <Link 
          href="/books/new"
          className="bg-green-600 text-white px-6 py-3 no-underline rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
        >
          ➕ Add New Book
        </Link>
      </div>

      {/* Tabs with Top Books and All Books */}
      <Tabs items={tabItems} defaultActiveKey="top" />

      {/* Summary */}
      {!loadingAll && !errorAll && !loadingTop && !errorTop && (
        <div className="mt-8 flex gap-5 justify-center">
          <div className="px-5 py-4 bg-yellow-50 rounded-md border-l-4 border-yellow-400 text-center">
            <div className="text-lg font-bold text-yellow-800">
              {topBooks.length}
            </div>
            <div className="text-xs text-yellow-800">Top Rated</div>
          </div>
          
          <div className="px-5 py-4 bg-cyan-50 rounded-md border-l-4 border-cyan-500 text-center">
            <div className="text-lg font-bold text-cyan-800">
              {allBooks.length}
            </div>
            <div className="text-xs text-cyan-800">Total Books</div>
          </div>
        </div>
      )}
    </div>
  );
} 