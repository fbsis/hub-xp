import React from 'react';
import { render, screen } from '@testing-library/react';
import { BookCard } from './BookCard';
import { BookWithStats } from '@/types/api';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

const mockBook: BookWithStats = {
  _id: '1',
  title: 'Test Book Title',
  author: 'Test Author',
  publishedYear: 2023,
  description: 'This is a test book description that should be displayed properly.',
  avgRating: 4.5,
  reviewCount: 12,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockBookMinimal: BookWithStats = {
  _id: '2',
  title: 'Minimal Book',
  author: 'Minimal Author',
  publishedYear: 2022,
  avgRating: 3.0,
  reviewCount: 1,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

describe('BookCard Component', () => {
  it('renders correctly with full book data', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('Published: 2023')).toBeInTheDocument();
    expect(screen.getByText('This is a test book description that should be displayed properly.')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('12 reviews')).toBeInTheDocument();
  });

  it('renders correctly without description', () => {
    const bookWithoutDescription = { ...mockBook, description: undefined };
    render(<BookCard book={bookWithoutDescription} />);
    
    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it('renders correct number of filled stars based on rating', () => {
    render(<BookCard book={mockBook} />);
    
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
    
    // Check that first 4 stars are filled (4.5 rating = 4 filled stars)
    stars.slice(0, 4).forEach(star => {
      expect(star).toHaveClass('text-yellow-400');
    });
    
    // Check that last star is unfilled
    expect(stars[4]).toHaveClass('text-gray-300');
  });

  it('displays rating value correctly', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays singular "review" for one review', () => {
    render(<BookCard book={mockBookMinimal} />);
    
    expect(screen.getByText('1 review')).toBeInTheDocument();
  });

  it('displays plural "reviews" for multiple reviews', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('12 reviews')).toBeInTheDocument();
  });

  it('has correct link to book detail page', () => {
    render(<BookCard book={mockBook} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/books/1');
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<BookCard book={mockBook} />);
    
    const cardDiv = container.querySelector('div[class*="bg-white"]');
    expect(cardDiv).toHaveClass(
      'bg-white', 'rounded-lg', 'shadow-md', 'hover:shadow-lg',
      'transition-shadow', 'duration-200', 'p-6', 'cursor-pointer',
      'border', 'border-gray-200'
    );
  });

  it('displays book with zero rating correctly', () => {
    const bookWithZeroRating = { ...mockBook, avgRating: 0, reviewCount: 0 };
    render(<BookCard book={bookWithZeroRating} />);
    
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText('0 reviews')).toBeInTheDocument();
    
    const stars = screen.getAllByText('★');
    stars.forEach(star => {
      expect(star).toHaveClass('text-gray-300');
    });
  });

  it('displays book with perfect rating correctly', () => {
    const bookWithPerfectRating = { ...mockBook, avgRating: 5.0, reviewCount: 25 };
    render(<BookCard book={bookWithPerfectRating} />);
    
    expect(screen.getByText('5.0')).toBeInTheDocument();
    expect(screen.getByText('25 reviews')).toBeInTheDocument();
    
    const stars = screen.getAllByText('★');
    stars.forEach(star => {
      expect(star).toHaveClass('text-yellow-400');
    });
  });

  it('handles long titles and descriptions with truncation classes', () => {
    const bookWithLongContent = {
      ...mockBook,
      title: 'This is a very long book title that should be truncated properly when displayed',
      description: 'This is a very long description that should be truncated to avoid making the card too tall and maintain consistent layout across all book cards in the grid.'
    };
    
    render(<BookCard book={bookWithLongContent} />);
    
    const title = screen.getByText(bookWithLongContent.title);
    const description = screen.getByText(bookWithLongContent.description);
    
    expect(title).toHaveClass('line-clamp-2');
    expect(description).toHaveClass('line-clamp-3');
  });

  it('displays author information correctly', () => {
    render(<BookCard book={mockBook} />);
    
    const authorElement = screen.getByText('by Test Author');
    expect(authorElement).toHaveClass('text-gray-600', 'text-sm', 'mb-2');
  });

  it('displays published year correctly', () => {
    render(<BookCard book={mockBook} />);
    
    const yearElement = screen.getByText('Published: 2023');
    expect(yearElement).toHaveClass('text-gray-500', 'text-xs');
  });

  it('handles edge case with fractional ratings', () => {
    const bookWithFractionalRating = { ...mockBook, avgRating: 2.7 };
    render(<BookCard book={bookWithFractionalRating} />);
    
    expect(screen.getByText('2.7')).toBeInTheDocument();
    
    const stars = screen.getAllByText('★');
    // With 2.7 rating, first 2 stars should be filled
    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[1]).toHaveClass('text-yellow-400');
    expect(stars[2]).toHaveClass('text-gray-300');
  });
}); 