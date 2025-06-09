import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with specified type', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders with number type', () => {
    render(<Input type="number" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('handles value and onChange', () => {
    const handleChange = jest.fn();
    render(<Input value="test" onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test');
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('is required when required prop is true', () => {
    render(<Input required />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('is readonly when readOnly prop is true', () => {
    render(<Input readOnly />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('renders with id and name attributes', () => {
    render(<Input id="test-input" name="test-name" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'test-name');
  });

  it('has correct Tailwind styling classes', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'w-full', 'px-3', 'py-2', 'border', 'rounded-md', 
      'text-sm', 'transition-colors', 'duration-200'
    );
  });

  it('has correct color classes', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'text-gray-900', 'bg-white', 'border-gray-300', 'placeholder-gray-500'
    );
  });

  it('has correct focus classes', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500'
    );
  });

  it('has correct disabled classes', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'disabled:bg-gray-100', 'disabled:text-gray-400', 'disabled:cursor-not-allowed'
    );
  });

  it('has correct hover classes', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('hover:border-gray-400');
  });

  it('accepts custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('combines base classes with custom className', () => {
    render(<Input className="border-red-500" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('w-full', 'px-3', 'py-2', 'border-red-500');
  });

  it('handles number input correctly', () => {
    const handleChange = jest.fn();
    render(<Input type="number" value={42} onChange={handleChange} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(42);
  });

  it('works with user interactions', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'hello');
    expect(handleChange).toHaveBeenCalled();
  });
}); 