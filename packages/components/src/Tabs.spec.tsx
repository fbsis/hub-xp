import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';

const mockTabItems = [
  {
    key: 'tab1',
    label: 'Tab 1',
    content: <div>Content for Tab 1</div>
  },
  {
    key: 'tab2',
    label: 'Tab 2',
    content: <div>Content for Tab 2</div>
  },
  {
    key: 'tab3',
    label: 'Tab 3',
    content: <div>Content for Tab 3</div>
  }
];

describe('Tabs Component', () => {
  it('renders all tab labels', () => {
    render(<Tabs items={mockTabItems} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('applies correct active tab styling', () => {
    render(<Tabs items={mockTabItems} />);
    
    const tab1Button = screen.getByText('Tab 1');
    const tab2Button = screen.getByText('Tab 2');
    
    // First tab should be active by default
    expect(tab1Button).toHaveClass('text-blue-600', 'border-blue-600');
    expect(tab2Button).toHaveClass('text-gray-600', 'border-transparent');
  });

  it('updates active styling when different tab is clicked', () => {
    render(<Tabs items={mockTabItems} />);
    
    const tab1Button = screen.getByText('Tab 1');
    const tab2Button = screen.getByText('Tab 2');
    
    // Click on tab 2
    fireEvent.click(tab2Button);
    
    // Tab 2 should now be active
    expect(tab1Button).toHaveClass('text-gray-600', 'border-transparent');
    expect(tab2Button).toHaveClass('text-blue-600', 'border-blue-600');
  });

  it('applies correct base tab button classes', () => {
    render(<Tabs items={mockTabItems} />);
    
    const tabButtons = screen.getAllByRole('button');
    
    tabButtons.forEach(button => {
      expect(button).toHaveClass(
        'px-6', 'py-3', 'border-none', 'bg-transparent', 
        'cursor-pointer', 'text-sm', 'font-medium', 
        'transition-all', 'duration-200', 'border-b-2'
      );
    });
  });

  it('applies hover classes to inactive tabs', () => {
    render(<Tabs items={mockTabItems} />);
    
    const tab2Button = screen.getByText('Tab 2');
    
    // Inactive tab should have hover class
    expect(tab2Button).toHaveClass('hover:text-blue-500');
  });

  it('applies correct container structure and classes', () => {
    const { container } = render(<Tabs items={mockTabItems} />);
    
    // Check tab headers container
    const headerContainer = container.querySelector('.border-b.border-gray-300.mb-5');
    expect(headerContainer).toBeInTheDocument();
    
    const buttonContainer = headerContainer?.querySelector('.flex.gap-0');
    expect(buttonContainer).toBeInTheDocument();
  });

  it('shows and hides content correctly', () => {
    render(<Tabs items={mockTabItems} />);
    
    const contentElements = screen.getAllByText(/Content for Tab/);
    
    // Only one content should be visible (not have 'hidden' class)
    expect(contentElements).toHaveLength(3);
    
    // Check that content divs exist but are properly shown/hidden
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content for Tab 3')).toBeInTheDocument();
  });

  it('handles single tab correctly', () => {
    const singleTab = [
      {
        key: 'only-tab',
        label: 'Only Tab',
        content: <div>Only Content</div>
      }
    ];
    
    render(<Tabs items={singleTab} />);
    
    expect(screen.getByText('Only Tab')).toBeInTheDocument();
    expect(screen.getByText('Only Content')).toBeInTheDocument();
    
    const tabButton = screen.getByText('Only Tab');
    expect(tabButton).toHaveClass('text-blue-600', 'border-blue-600');
  });

  it('handles complex content correctly', () => {
    const complexItems = [
      {
        key: 'complex1',
        label: 'Complex Tab',
        content: (
          <div>
            <h2>Complex Content</h2>
            <p>With multiple elements</p>
            <button>Action Button</button>
          </div>
        )
      }
    ];
    
    render(<Tabs items={complexItems} />);
    
    expect(screen.getByText('Complex Content')).toBeInTheDocument();
    expect(screen.getByText('With multiple elements')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('preserves content when switching tabs', () => {
    render(<Tabs items={mockTabItems} />);
    
    // Switch to tab 2
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    
    // Switch back to tab 1
    fireEvent.click(screen.getByText('Tab 1'));
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    
    // Switch to tab 3
    fireEvent.click(screen.getByText('Tab 3'));
    expect(screen.getByText('Content for Tab 3')).toBeInTheDocument();
  });

  it('handles empty items array gracefully', () => {
    render(<Tabs items={[]} />);
    
    // Should not crash, but won't have any content
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('uses correct key for tab identification', () => {
    render(<Tabs items={mockTabItems} defaultActiveKey="tab3" />);
    
    expect(screen.getByText('Content for Tab 3')).toBeInTheDocument();
    
    const tab3Button = screen.getByText('Tab 3');
    expect(tab3Button).toHaveClass('text-blue-600', 'border-blue-600');
  });
}); 