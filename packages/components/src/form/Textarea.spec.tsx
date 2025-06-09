import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea Component', () => {
  it('renders correctly with default props', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('displays the correct value', () => {
    render(<Textarea value="test content" readOnly />);
    const textarea = screen.getByDisplayValue('test content');
    expect(textarea).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5); // once for each character
  });

  it('renders with placeholder text', () => {
    render(<Textarea placeholder="Enter your message" />);
    const textarea = screen.getByPlaceholderText('Enter your message');
    expect(textarea).toBeInTheDocument();
  });

  it('renders as required when required prop is true', () => {
    render(<Textarea required />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeRequired();
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('applies correct id and name attributes', () => {
    render(<Textarea id="test-textarea" name="testName" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'test-textarea');
    expect(textarea).toHaveAttribute('name', 'testName');
  });

  it('renders with custom rows', () => {
    render(<Textarea rows={5} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('renders with default rows when not specified', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('has correct styling', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveStyle({
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
      minHeight: '60px',
      resize: 'vertical'
    });
  });

  it('handles long text content', () => {
    const longText = 'This is a very long text content that should be handled properly by the textarea component.';
    render(<Textarea value={longText} readOnly />);
    const textarea = screen.getByDisplayValue(longText);
    expect(textarea).toBeInTheDocument();
  });

  it('handles empty string value', () => {
    render(<Textarea value="" readOnly />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('');
  });

  it('combines all props correctly', () => {
    const handleChange = jest.fn();
    render(
      <Textarea 
        id="complex-textarea"
        name="complexName"
        value="Complex content"
        onChange={handleChange}
        placeholder="Enter complex text"
        required
        rows={4}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'complex-textarea');
    expect(textarea).toHaveAttribute('name', 'complexName');
    expect(textarea).toHaveValue('Complex content');
    expect(textarea).toHaveAttribute('placeholder', 'Enter complex text');
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('rows', '4');
  });
}); 