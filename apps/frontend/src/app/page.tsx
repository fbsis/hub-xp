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
  const response = await fetch("http://localhost:3001/books/top?limit=6");
  
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
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', margin: '0 0 16px 0' }}>📚 Book Reviews</h1>
        <p style={{ fontSize: '18px', color: '#666', margin: '0 0 20px 0' }}>
          Discover and review amazing books
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link 
            href="/books"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            Browse All Books
          </Link>
          <Link 
            href="/books/new"
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            Add New Book
          </Link>
        </div>
      </div>

      {/* Top Rated Books Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>⭐ Top Rated Books</h2>
        
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Loading top books...
          </div>
        )}

        {error && (
          <div style={{ 
            color: 'red', 
            padding: '20px', 
            backgroundColor: '#ffe6e6',
            borderRadius: '6px'
          }}>
            Error loading books: {error.message}
          </div>
        )}

        {!isLoading && !error && books.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#666'
          }}>
            No books available yet. Be the first to add one!
          </div>
        )}

        {!isLoading && !error && books.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!isLoading && !error && books.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link 
            href="/books"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '16px'
            }}
          >
            View all books →
          </Link>
        </div>
      )}
    </div>
  );
}
