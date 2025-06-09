import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders with type submit', () => {
    render(<Button type="submit">Submit Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled and clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is not disabled by default', () => {
    render(<Button>Enabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('renders with primary variant classes by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600', 'text-white');
  });

  it('renders with secondary variant classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-600', 'text-white');
  });

  it('has correct base Tailwind classes', () => {
    render(<Button>Styled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'px-5', 'py-2.5', 'border-0', 'rounded', 
      'text-sm', 'font-medium', 'transition-opacity', 'duration-200'
    );
  });

  it('has correct cursor classes when enabled', () => {
    render(<Button>Enabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-pointer');
    expect(button).not.toHaveClass('opacity-60', 'cursor-not-allowed');
  });

  it('has correct cursor classes when disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-60', 'cursor-not-allowed');
    expect(button).not.toHaveClass('cursor-pointer');
  });

  it('renders children correctly', () => {
    render(
      <Button>
        <span>Complex</span> Content
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Complex Content');
  });

  it('combines all props correctly', () => {
    const handleClick = jest.fn();
    render(
      <Button 
        type="submit" 
        onClick={handleClick} 
        variant="secondary"
        disabled={false}
      >
        Submit Form
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveTextContent('Submit Form');
    expect(button).toHaveClass('bg-gray-600', 'text-white');
    expect(button).not.toBeDisabled();
  });

  it('applies focus ring classes for accessibility', () => {
    render(<Button variant="primary">Focus Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:ring-2', 'focus:ring-blue-300');
  });

  it('applies hover classes for primary variant', () => {
    render(<Button variant="primary">Hover Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-blue-700');
  });

  it('applies hover classes for secondary variant', () => {
    render(<Button variant="secondary">Hover Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-gray-700');
  });
}); 