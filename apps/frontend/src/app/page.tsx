"use client";

import { useQuery } from "@tanstack/react-query";
import { BookWithStats } from "@domain/core";
import { BookCard } from "@components/ui";
import Link from "next/link";

// Simple API client
async function fetchTopBooks(): Promise<BookWithStats[]> {
  const response = await fetch("http://localhost:3001/books/top?limit=10");
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
}

export default function HomePage() {
  const { data: books, isLoading, error } = useQuery({
    queryKey: ["books", "top"],
    queryFn: fetchTopBooks,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-red-600">
          Error loading books. Make sure the backend is running on port 3001.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Top Rated Books</h1>
        <Link
          href="/books/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Book
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {books?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found</p>
          <Link
            href="/books/new"
            className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
          >
            Add the first book
          </Link>
        </div>
      )}
    </div>
  );
}
