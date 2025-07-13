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
      'px-5', 'py-2.5', 'rounded', 'text-sm', 
      'font-medium', 'transition-all', 'duration-200', 'border-none'
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

  it('changes background color on mouse enter for primary variant', () => {
    render(<Button variant="primary">Hover Button</Button>);
    const button = screen.getByRole('button');
    
    // Initial background color
    expect(button.style.backgroundColor).toBe('rgb(37, 99, 235)'); // #2563eb
    
    // Trigger mouse enter
    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).toBe('rgb(29, 78, 216)'); // #1d4ed8
  });

  it('changes background color on mouse enter for secondary variant', () => {
    render(<Button variant="secondary">Hover Button</Button>);
    const button = screen.getByRole('button');
    
    // Initial background color
    expect(button.style.backgroundColor).toBe('rgb(75, 85, 99)'); // #4b5563
    
    // Trigger mouse enter
    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).toBe('rgb(55, 65, 81)'); // #374151
  });

  it('resets background color on mouse leave for primary variant', () => {
    render(<Button variant="primary">Hover Button</Button>);
    const button = screen.getByRole('button');
    
    // Mouse enter first
    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).toBe('rgb(29, 78, 216)'); // #1d4ed8
    
    // Then mouse leave
    fireEvent.mouseLeave(button);
    expect(button.style.backgroundColor).toBe('rgb(37, 99, 235)'); // #2563eb
  });

  it('resets background color on mouse leave for secondary variant', () => {
    render(<Button variant="secondary">Hover Button</Button>);
    const button = screen.getByRole('button');
    
    // Mouse enter first
    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).toBe('rgb(55, 65, 81)'); // #374151
    
    // Then mouse leave
    fireEvent.mouseLeave(button);
    expect(button.style.backgroundColor).toBe('rgb(75, 85, 99)'); // #4b5563
  });

  it('does not change background color on mouse enter when disabled', () => {
    render(<Button disabled variant="primary">Disabled Hover</Button>);
    const button = screen.getByRole('button');
    
    const initialColor = button.style.backgroundColor;
    
    // Trigger mouse enter on disabled button
    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).toBe(initialColor);
  });

  it('does not change background color on mouse leave when disabled', () => {
    render(<Button disabled variant="secondary">Disabled Hover</Button>);
    const button = screen.getByRole('button');
    
    const initialColor = button.style.backgroundColor;
    
    // Trigger mouse leave on disabled button
    fireEvent.mouseLeave(button);
    expect(button.style.backgroundColor).toBe(initialColor);
  });

  it('applies custom className alongside default classes', () => {
    render(<Button className="custom-btn-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('custom-btn-class');
    expect(button).toHaveClass('px-5', 'py-2.5', 'rounded');
  });
}); 