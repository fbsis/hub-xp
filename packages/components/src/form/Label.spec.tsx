import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label Component', () => {
  it('renders correctly with children', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('applies htmlFor attribute correctly', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('renders without htmlFor when not provided', () => {
    render(<Label>Label without for</Label>);
    const label = screen.getByText('Label without for');
    expect(label).not.toHaveAttribute('for');
  });

  it('shows required asterisk when required is true', () => {
    render(<Label required>Required Field</Label>);
    const label = screen.getByText('Required Field');
    const asterisk = screen.getByText('*');
    expect(label).toBeInTheDocument();
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-red-500', 'ml-0.5');
  });

  it('does not show asterisk when required is false', () => {
    render(<Label required={false}>Optional Field</Label>);
    const label = screen.getByText('Optional Field');
    expect(label).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('does not show asterisk by default', () => {
    render(<Label>Default Field</Label>);
    const label = screen.getByText('Default Field');
    expect(label).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has correct Tailwind styling classes', () => {
    render(<Label>Styled Label</Label>);
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass(
      'block', 'mb-1.5', 'font-medium', 'text-sm', 'text-gray-800'
    );
  });

  it('renders complex children correctly', () => {
    render(
      <Label htmlFor="complex">
        <span>Complex</span> Label Content
      </Label>
    );
    const label = screen.getByText('Label Content');
    expect(label).toHaveAttribute('for', 'complex');
    expect(screen.getByText('Complex')).toBeInTheDocument();
  });

  it('combines htmlFor and required props correctly', () => {
    render(<Label htmlFor="required-input" required>Required Input</Label>);
    const label = screen.getByText('Required Input');
    const asterisk = screen.getByText('*');
    
    expect(label).toHaveAttribute('for', 'required-input');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-red-500', 'ml-0.5');
  });

  it('handles empty children gracefully', () => {
    const { container } = render(<Label></Label>);
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('block', 'mb-1.5', 'font-medium', 'text-sm', 'text-gray-800');
  });

  it('applies all styling classes consistently', () => {
    render(<Label htmlFor="test" required>Consistent Styling</Label>);
    const label = screen.getByText('Consistent Styling');
    
    expect(label).toHaveClass('block');
    expect(label).toHaveClass('mb-1.5');
    expect(label).toHaveClass('font-medium');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('text-gray-800');
  });
}); 