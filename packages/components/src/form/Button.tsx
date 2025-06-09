import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  type = 'button', 
  onClick, 
  disabled = false, 
  children, 
  variant = 'primary' 
}: ButtonProps) {
  const baseClasses = "px-5 py-2.5 border-0 rounded text-sm font-medium transition-opacity duration-200";
  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-300"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
    >
      {children}
    </button>
  );
} 