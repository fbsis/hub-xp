"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, BookCard } from "@components/ui";
import Link from "next/link";
import { useState } from "react";

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
  const response = await fetch("http://localhost:3001/books");
  
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  
  const data = await response.json();
  return data.books || [];
}

// API function to fetch top books
async function fetchTopBooks(): Promise<BookWithStats[]> {
  const response = await fetch("http://localhost:3001/books/top?limit=20");
  
  if (!response.ok) {
    throw new Error("Failed to fetch top books");
  }
  
  return response.json();
}

export default function BooksPage() {
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
    setSelectedBook(bookId);
    // You can implement a modal or redirect to review page here
    alert(`Add review for book: ${bookId}`);
  };

  // Top Books View Component
  const TopBooksView = () => {
    if (loadingTop) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading top rated books...
        </div>
      );
    }

    if (errorTop) {
      return (
        <div style={{ 
          color: 'red', 
          padding: '20px', 
          backgroundColor: '#ffe6e6',
          borderRadius: '6px'
        }}>
          Error loading top books: {errorTop.message}
        </div>
      );
    }

    if (topBooks.length === 0) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666'
        }}>
          No rated books yet. Add some reviews to see top books!
        </div>
      );
    }

    return (
      <div>
        <div style={{ 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f0f8ff',
          borderRadius: '6px',
          borderLeft: '4px solid #007bff'
        }}>
          <p style={{ margin: 0, color: '#007bff', fontWeight: '500' }}>
            ⭐ These are the highest rated books. Click on any book to add your review!
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {topBooks.map((book) => (
            <div
              key={book._id}
              onClick={() => handleBookClick(book._id)}
              style={{ cursor: 'pointer' }}
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
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading all books...
        </div>
      );
    }

    if (errorAll) {
      return (
        <div style={{ 
          color: 'red', 
          padding: '20px', 
          backgroundColor: '#ffe6e6',
          borderRadius: '6px'
        }}>
          Error loading books: {errorAll.message}
        </div>
      );
    }

    if (allBooks.length === 0) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666'
        }}>
          No books available yet. Be the first to add one!
        </div>
      );
    }

    return (
      <div>
        <div style={{ 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f0f8ff',
          borderRadius: '6px',
          borderLeft: '4px solid #28a745'
        }}>
          <p style={{ margin: 0, color: '#28a745', fontWeight: '500' }}>
            📚 All books in the library. Click on any book to add your review!
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {allBooks.map((book) => (
            <div
              key={book._id}
              onClick={() => handleBookClick(book._id)}
              style={{ cursor: 'pointer' }}
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
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0' }}>📖 Book Reviews</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
            Discover great books and share your thoughts
          </p>
        </div>
        <Link 
          href="/books/new"
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ➕ Add New Book
        </Link>
      </div>

      {/* Tabs with Top Books and All Books */}
      <Tabs items={tabItems} defaultActiveKey="top" />

      {/* Summary */}
      {!loadingAll && !errorAll && !loadingTop && !errorTop && (
        <div style={{ 
          marginTop: '30px', 
          display: 'flex',
          gap: '20px',
          justifyContent: 'center'
        }}>
          <div style={{
            padding: '15px 20px',
            backgroundColor: '#fff3cd',
            borderRadius: '6px',
            borderLeft: '4px solid #ffc107',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#856404' }}>
              {topBooks.length}
            </div>
            <div style={{ fontSize: '12px', color: '#856404' }}>Top Rated</div>
          </div>
          
          <div style={{
            padding: '15px 20px',
            backgroundColor: '#d1ecf1',
            borderRadius: '6px',
            borderLeft: '4px solid #17a2b8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c5460' }}>
              {allBooks.length}
            </div>
            <div style={{ fontSize: '12px', color: '#0c5460' }}>Total Books</div>
          </div>
        </div>
      )}
    </div>
  );
} 