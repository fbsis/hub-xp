import React from 'react';

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
  readOnly = false
}: InputProps) {
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
      className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  );
} 