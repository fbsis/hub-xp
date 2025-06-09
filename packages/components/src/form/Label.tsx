import React from 'react';

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ htmlFor, children, required = false }: LabelProps) {
  return (
    <label 
      htmlFor={htmlFor}
      className="block mb-1.5 font-medium text-sm text-gray-800"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
} 