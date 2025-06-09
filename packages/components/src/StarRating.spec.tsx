import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarRating } from './StarRating';

describe('StarRating Component', () => {
  it('renders 5 stars by default', () => {
    render(<StarRating />);
    
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
    
    stars.forEach((star, index) => {
      expect(star).toHaveAttribute('title', `${index + 1} star${index + 1 !== 1 ? 's' : ''}`);
      expect(star).toHaveTextContent('★');
    });
  });

  it('displays correct value with rating text', () => {
    render(<StarRating value={3} />);
    
    expect(screen.getByText('(3/5)')).toBeInTheDocument();
  });

  it('does not display rating text when value is 0', () => {
    render(<StarRating value={0} />);
    
    expect(screen.queryByText(/\(\d\/5\)/)).not.toBeInTheDocument();
  });

  it('applies correct filled stars based on value', () => {
    render(<StarRating value={3} />);
    
    const stars = screen.getAllByRole('button');
    
    // First 3 stars should be filled (yellow)
    stars.slice(0, 3).forEach(star => {
      expect(star).toHaveClass('text-yellow-400');
    });
    
    // Last 2 stars should be unfilled (gray)
    stars.slice(3).forEach(star => {
      expect(star).toHaveClass('text-gray-300');
    });
  });

  it('calls onChange when star is clicked', () => {
    const handleChange = jest.fn();
    render(<StarRating onChange={handleChange} />);
    
    const thirdStar = screen.getAllByRole('button')[2];
    fireEvent.click(thirdStar);
    
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('does not call onChange when readonly', () => {
    const handleChange = jest.fn();
    render(<StarRating onChange={handleChange} readonly />);
    
    const thirdStar = screen.getAllByRole('button')[2];
    fireEvent.click(thirdStar);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('disables buttons when readonly', () => {
    render(<StarRating readonly />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toBeDisabled();
      expect(star).toHaveClass('cursor-default');
    });
  });

  it('enables buttons when not readonly', () => {
    render(<StarRating />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).not.toBeDisabled();
      expect(star).toHaveClass('cursor-pointer');
    });
  });

  it('applies small size classes', () => {
    render(<StarRating size="small" />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toHaveClass('text-base');
    });
  });

  it('applies medium size classes by default', () => {
    render(<StarRating />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toHaveClass('text-xl');
    });
  });

  it('applies large size classes', () => {
    render(<StarRating size="large" />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toHaveClass('text-3xl');
    });
  });

  it('shows hover effect on mouse enter when not readonly', async () => {
    const user = userEvent.setup();
    render(<StarRating />);
    
    const stars = screen.getAllByRole('button');
    const thirdStar = stars[2];
    
    await user.hover(thirdStar);
    
    // First 3 stars should be highlighted on hover
    stars.slice(0, 3).forEach(star => {
      expect(star).toHaveClass('text-yellow-400');
    });
  });

  it('does not show hover effect when readonly', async () => {
    const user = userEvent.setup();
    render(<StarRating readonly value={1} />);
    
    const stars = screen.getAllByRole('button');
    const thirdStar = stars[2];
    
    await user.hover(thirdStar);
    
    // Only first star should be highlighted (based on value, not hover)
    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[1]).toHaveClass('text-gray-300');
    expect(stars[2]).toHaveClass('text-gray-300');
  });

  it('resets hover state on mouse leave', async () => {
    const user = userEvent.setup();
    render(<StarRating value={1} />);
    
    const stars = screen.getAllByRole('button');
    const thirdStar = stars[2];
    
    // Hover over third star
    await user.hover(thirdStar);
    
    // Then move mouse away
    await user.unhover(thirdStar);
    
    // Should go back to original value (1 star)
    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[1]).toHaveClass('text-gray-300');
    expect(stars[2]).toHaveClass('text-gray-300');
  });

  it('has correct button attributes', () => {
    render(<StarRating />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toHaveAttribute('type', 'button');
      expect(star).toHaveClass('bg-transparent', 'border-none', 'p-0.5', 'transition-colors', 'duration-200');
    });
  });

  it('combines value and onChange correctly', () => {
    const handleChange = jest.fn();
    render(<StarRating value={2} onChange={handleChange} />);
    
    expect(screen.getByText('(2/5)')).toBeInTheDocument();
    
    const fifthStar = screen.getAllByRole('button')[4];
    fireEvent.click(fifthStar);
    
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('handles edge case values correctly', () => {
    render(<StarRating value={5} />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      expect(star).toHaveClass('text-yellow-400');
    });
    
    expect(screen.getByText('(5/5)')).toBeInTheDocument();
  });

}); 