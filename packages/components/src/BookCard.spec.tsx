import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard } from './BookCard';

const mockBook = {
  _id: '1',
  title: 'Test Book',
  author: 'Test Author',
  publishedYear: 2023,
  description: 'This is a test book description',
  avgRating: 4.5,
  reviewCount: 10
};

const mockBookMinimal = {
  _id: '2',
  title: 'Minimal Book',
  author: 'Minimal Author',
  publishedYear: 2022
};

describe('BookCard Component', () => {
  it('renders correctly with full book data', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('Published: 2023')).toBeInTheDocument();
    expect(screen.getByText('This is a test book description')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('10 reviews')).toBeInTheDocument();
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('renders correctly with minimal book data', () => {
    render(<BookCard book={mockBookMinimal} />);
    
    expect(screen.getByText('Minimal Book')).toBeInTheDocument();
    expect(screen.getByText('by Minimal Author')).toBeInTheDocument();
    expect(screen.getByText('Published: 2022')).toBeInTheDocument();
    expect(screen.queryByText('★')).not.toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<BookCard book={mockBookMinimal} />);
    
    expect(screen.queryByText(/description/)).not.toBeInTheDocument();
  });

  it('does not render rating section when rating or reviewCount is undefined', () => {
    const bookWithoutRating = {
      ...mockBook,
      avgRating: undefined,
      reviewCount: undefined
    };
    
    render(<BookCard book={bookWithoutRating} />);
    
    expect(screen.queryByText('★')).not.toBeInTheDocument();
  });

  it('renders singular "review" for one review', () => {
    const bookWithOneReview = {
      ...mockBook,
      reviewCount: 1
    };
    
    render(<BookCard book={bookWithOneReview} />);
    
    expect(screen.getByText('1 review')).toBeInTheDocument();
  });

  it('renders plural "reviews" for multiple reviews', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('10 reviews')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<BookCard book={mockBook} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test Book'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when not provided', () => {
    render(<BookCard book={mockBook} />);
    
    // Should not throw error when clicking without onClick
    fireEvent.click(screen.getByText('Test Book'));
  });

  it('applies custom className', () => {
    const { container } = render(
      <BookCard book={mockBook} className="custom-class" />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('has correct base CSS classes', () => {
    const { container } = render(<BookCard book={mockBook} />);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      'bg-white', 'rounded-lg', 'shadow-md', 'hover:shadow-lg',
      'transition-shadow', 'duration-200', 'p-6', 'cursor-pointer',
      'border', 'border-gray-200'
    );
  });

  it('formats rating to one decimal place', () => {
    const bookWithPreciseRating = {
      ...mockBook,
      avgRating: 4.56789
    };
    
    render(<BookCard book={bookWithPreciseRating} />);
    
    expect(screen.getByText('4.6')).toBeInTheDocument();
  });

  it('handles zero rating correctly', () => {
    const bookWithZeroRating = {
      ...mockBook,
      avgRating: 0,
      reviewCount: 5
    };
    
    render(<BookCard book={bookWithZeroRating} />);
    
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText('5 reviews')).toBeInTheDocument();
  });

  it('handles zero reviews correctly', () => {
    const bookWithZeroReviews = {
      ...mockBook,
      avgRating: 0,
      reviewCount: 0
    };
    
    render(<BookCard book={bookWithZeroReviews} />);
    
    expect(screen.getByText('0 reviews')).toBeInTheDocument();
  });

  it('applies correct text styling classes', () => {
    render(<BookCard book={mockBook} />);
    
    const title = screen.getByText('Test Book');
    const author = screen.getByText('by Test Author');
    const year = screen.getByText('Published: 2023');
    
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900', 'mb-2');
    expect(author).toHaveClass('text-gray-600', 'text-sm', 'mb-1');
    expect(year).toHaveClass('text-gray-500', 'text-xs', 'mb-3');
  });
}); 