import React from 'react';
import { clsx } from 'clsx';

interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  id?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

export function Input({ 
  type = 'text', 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  readOnly = false,
  className = ""
}: InputProps) {
  const inputClasses = clsx(
    // Base styles
    'w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200',
    // Default colors
    'text-gray-900 bg-white border-gray-300 placeholder-gray-500',
    // Focus states
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    // Disabled states
    'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
    // Hover states
    'hover:border-gray-400',
    // Custom classes
    className
  );

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      className={inputClasses}
    />
  );
} 