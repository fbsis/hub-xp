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
  
  const sizes = {
    small: '16px',
    medium: '24px',
    large: '32px'
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
    <div style={{ display: 'flex', gap: '2px' }}>
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
            style={{
              background: 'none',
              border: 'none',
              cursor: readonly ? 'default' : 'pointer',
              fontSize: sizes[size],
              color: filled ? '#ffc107' : '#e0e0e0',
              padding: '2px',
              transition: 'color 0.2s ease'
            }}
            title={`${star} star${star !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
      {value > 0 && (
        <span style={{ 
          marginLeft: '8px', 
          fontSize: '14px', 
          color: '#666',
          alignSelf: 'center'
        }}>
          ({value}/5)
        </span>
      )}
    </div>
  );
} 