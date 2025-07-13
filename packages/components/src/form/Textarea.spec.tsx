import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea Component', () => {
  it('renders correctly with default props', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('renders with custom rows', () => {
    render(<Textarea rows={5} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('handles value and onChange', () => {
    const handleChange = jest.fn();
    render(<Textarea value="test content" onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('test content');
    
    fireEvent.change(textarea, { target: { value: 'new content' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with placeholder', () => {
    render(<Textarea placeholder="Enter description" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', 'Enter description');
  });

  it('is required when required prop is true', () => {
    render(<Textarea required />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeRequired();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('is readonly when readOnly prop is true', () => {
    render(<Textarea readOnly />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readonly');
  });

  it('renders with id and name attributes', () => {
    render(<Textarea id="test-textarea" name="test-name" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'test-textarea');
    expect(textarea).toHaveAttribute('name', 'test-name');
  });

  it('has correct Tailwind styling classes', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass(
      'w-full', 'px-3', 'py-2', 'border', 'rounded-md', 
      'text-sm', 'transition-colors', 'duration-200', 'resize-y'
    );
  });

  it('has correct color classes', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass(
      'text-gray-900', 'bg-white', 'border-gray-300', 'placeholder-gray-500'
    );
  });

  it('has correct focus classes', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass(
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500'
    );
  });

  it('has correct disabled classes', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass(
      'disabled:bg-gray-100', 'disabled:text-gray-400', 'disabled:cursor-not-allowed'
    );
  });

  it('has correct hover classes', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('hover:border-gray-400');
  });

  it('accepts custom className', () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-class');
  });

  it('combines base classes with custom className', () => {
    render(<Textarea className="border-red-500" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('w-full', 'px-3', 'py-2', 'border-red-500');
  });

  it('works with user interactions', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    
    await user.type(textarea, 'hello world');
    expect(handleChange).toHaveBeenCalled();
  });
}); 