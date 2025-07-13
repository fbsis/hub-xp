import React, { useState } from 'react';

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function StarRating({ 
  value = 0, 
  onChange, 
  readonly = false,
  size = 'medium' 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    small: 'text-base',
    medium: 'text-xl',
    large: 'text-3xl'
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hoverRating || value);
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`
              bg-transparent border-none p-0.5 transition-colors duration-200
              ${readonly ? 'cursor-default' : 'cursor-pointer'}
              ${filled ? 'text-yellow-400' : 'text-gray-300'}
              ${sizeClasses[size]}
            `}
            title={`${star} star${star !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-600 self-center">
          ({value}/5)
        </span>
      )}
    </div>
  );
} 