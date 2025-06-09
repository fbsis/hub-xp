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
      style={{
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500',
        fontSize: '14px',
        color: '#333'
      }}
    >
      {children}
      {required && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
    </label>
  );
} 