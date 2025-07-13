import React from 'react';
import { clsx } from 'clsx';

interface TextareaProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  className?: string;
}

export function Textarea({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  readOnly = false,
  rows = 3,
  className = ""
}: TextareaProps) {
  const textareaClasses = clsx(
    // Base styles
    'w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200 resize-y',
    // Default colors
    'text-gray-900 bg-white border-gray-300 placeholder-gray-500',
    // Focus states
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    // Disabled states
    'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
    // Hover states
    'hover:border-gray-400 bg-red-500',
    // Custom classes
    className
  );

  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      rows={rows}
      className={textareaClasses}
    />
  );
} 