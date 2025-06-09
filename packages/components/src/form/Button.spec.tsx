import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Click me');
  });

  it('renders with custom type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders with primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      backgroundColor: '#007bff',
      color: 'white'
    });
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      backgroundColor: '#6c757d',
      color: 'white'
    });
  });

  it('has correct base styling', () => {
    render(<Button>Styled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      padding: '10px 20px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500'
    });
  });

  it('has correct cursor style when enabled', () => {
    render(<Button>Enabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      cursor: 'pointer',
      opacity: 1
    });
  });

  it('has correct cursor style when disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      cursor: 'not-allowed',
      opacity: 0.6
    });
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
    expect(button).toHaveStyle({
      backgroundColor: '#6c757d',
      color: 'white'
    });
    expect(button).not.toBeDisabled();
  });
}); 