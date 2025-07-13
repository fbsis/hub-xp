import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function Button({ 
  type = 'button', 
  onClick, 
  disabled = false, 
  children, 
  variant = 'primary',
  className = ""
}: ButtonProps) {
  const buttonClasses = clsx(
    // Base styles
    'px-5 py-2.5 rounded text-sm font-medium transition-all duration-200 border-none',
    // Cursor and disabled states
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
    // Variant styles
    variant === 'primary' 
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300'
      : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-300',
    // Custom classes
    className
  );

  // Fallback inline styles
  const fallbackStyles: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'background-color 0.2s, opacity 0.2s',
    backgroundColor: variant === 'primary' ? '#2563eb' : '#4b5563',
    color: '#ffffff'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      style={fallbackStyles}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variant === 'primary' ? '#1d4ed8' : '#374151';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variant === 'primary' ? '#2563eb' : '#4b5563';
        }
      }}
    >
      {children}
    </button>
  );
} 