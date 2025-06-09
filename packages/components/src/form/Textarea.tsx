import React from 'react';

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
  rows = 3
}: TextareaProps) {
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
      className="w-full px-2 py-2 border border-gray-300 rounded text-sm min-h-15 resize-y focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  );
} 