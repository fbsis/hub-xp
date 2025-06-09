import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label Component', () => {
  it('renders correctly with default props', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('renders children correctly', () => {
    render(<Label>My Label Text</Label>);
    const label = screen.getByText('My Label Text');
    expect(label).toBeInTheDocument();
  });

  it('applies htmlFor attribute correctly', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('shows required asterisk when required is true', () => {
    render(<Label required>Required Field</Label>);
    const label = screen.getByText(/Required Field/);
    expect(label).toBeInTheDocument();
    
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveStyle({ color: 'red', marginLeft: '2px' });
  });

  it('does not show asterisk when required is false', () => {
    render(<Label required={false}>Optional Field</Label>);
    const label = screen.getByText('Optional Field');
    expect(label).toBeInTheDocument();
    
    const asterisk = screen.queryByText('*');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('does not show asterisk by default', () => {
    render(<Label>Default Field</Label>);
    const label = screen.getByText('Default Field');
    expect(label).toBeInTheDocument();
    
    const asterisk = screen.queryByText('*');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('has correct styling', () => {
    render(<Label>Styled Label</Label>);
    const label = screen.getByText('Styled Label');
    expect(label).toHaveStyle({
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#333'
    });
  });

  it('renders with complex children', () => {
    render(
      <Label htmlFor="complex">
        <span>Complex</span> Label
      </Label>
    );
    const label = screen.getByText('Complex').closest('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'complex');
  });

  it('combines htmlFor and required props correctly', () => {
    render(<Label htmlFor="required-input" required>Required Input</Label>);
    const label = screen.getByText(/Required Input/);
    expect(label).toHaveAttribute('for', 'required-input');
    
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
  });
}); 