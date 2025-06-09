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

  it('renders with custom type', () => {
    render(<Input type="number" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('renders with email type', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders with password type', () => {
    render(<Input type="password" />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('displays the correct value', () => {
    render(<Input value="test value" readOnly />);
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5); // once for each character
  });

  it('renders with placeholder text', () => {
    render(<Input placeholder="Enter your name" />);
    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
  });

  it('renders as required when required prop is true', () => {
    render(<Input required />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies correct id and name attributes', () => {
    render(<Input id="test-input" name="testName" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'testName');
  });

  it('has correct styling', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveStyle({
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px'
    });
  });

  it('handles numeric values correctly', () => {
    render(<Input type="number" value={42} readOnly />);
    const input = screen.getByDisplayValue('42');
    expect(input).toBeInTheDocument();
  });
}); 