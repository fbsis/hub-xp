import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table } from './Table';

const mockColumns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' }
];

const mockData = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 }
];

const mockColumnsWithRender = [
  { key: 'id', title: 'ID' },
  { 
    key: 'name', 
    title: 'Full Name',
    render: (value: string, record: any) => <strong>{value.toUpperCase()}</strong>
  },
  { 
    key: 'actions', 
    title: 'Actions',
    render: (value: any, record: any) => <button>Edit {record.name}</button>
  }
];

describe('Table Component', () => {
  it('renders table with headers and data', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    
    // Check headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    
    // Check data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Table columns={mockColumns} data={[]} loading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows no data message when data is empty', () => {
    render(<Table columns={mockColumns} data={[]} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('applies correct table structure and classes', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass('w-full', 'border-collapse', 'border', 'border-gray-300');
    
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    expect(thead).toBeInTheDocument();
    expect(tbody).toBeInTheDocument();
  });

  it('applies correct header styling', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    
    const headerRow = screen.getByRole('table').querySelector('thead tr');
    expect(headerRow).toHaveClass('bg-gray-100');
    
    const headers = screen.getAllByRole('columnheader');
    headers.forEach(header => {
      expect(header).toHaveClass('p-3', 'text-left', 'border-b', 'border-gray-300', 'font-semibold');
    });
  });

  it('applies correct row styling', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    
    const dataRows = screen.getByRole('table').querySelectorAll('tbody tr');
    dataRows.forEach(row => {
      expect(row).toHaveClass('border-b', 'border-gray-200', 'hover:bg-gray-50');
    });
  });

  it('applies correct cell styling', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    
    const cells = screen.getByRole('table').querySelectorAll('tbody td');
    cells.forEach(cell => {
      expect(cell).toHaveClass('p-3', 'border-b', 'border-gray-200');
    });
  });

  it('renders custom content with render function', () => {
    render(<Table columns={mockColumnsWithRender} data={mockData} />);
    
    // Custom rendered name should be uppercase and bold
    expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
    expect(screen.getByText('JANE SMITH')).toBeInTheDocument();
    
    // Custom action buttons
    expect(screen.getByText('Edit John Doe')).toBeInTheDocument();
    expect(screen.getByText('Edit Jane Smith')).toBeInTheDocument();
  });

  it('handles columns without render function', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    
    // Regular text content without custom rendering
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles missing data properties gracefully', () => {
    const incompleteData = [
      { id: 1, name: 'John Doe' }, // missing age
      { id: 2, age: 25 } // missing name
    ];
    
    render(<Table columns={mockColumns} data={incompleteData} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders correct number of rows and columns', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    
    const table = screen.getByRole('table');
    const headerCells = table.querySelectorAll('thead th');
    const dataRows = table.querySelectorAll('tbody tr');
    
    expect(headerCells).toHaveLength(3); // 3 columns
    expect(dataRows).toHaveLength(2); // 2 data rows
    
    dataRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      expect(cells).toHaveLength(3); // 3 cells per row
    });
  });

  it('handles single row of data', () => {
    const singleRowData = [{ id: 1, name: 'Solo User', age: 35 }];
    
    render(<Table columns={mockColumns} data={singleRowData} />);
    
    expect(screen.getByText('Solo User')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    
    const dataRows = screen.getByRole('table').querySelectorAll('tbody tr');
    expect(dataRows).toHaveLength(1);
  });

  it('loading state has correct styling', () => {
    render(<Table columns={mockColumns} data={[]} loading={true} />);
    
    const loadingDiv = screen.getByText('Loading...');
    expect(loadingDiv).toHaveClass('p-5', 'text-center');
  });

  it('no data state has correct styling', () => {
    render(<Table columns={mockColumns} data={[]} />);
    
    const noDataDiv = screen.getByText('No data available');
    expect(noDataDiv).toHaveClass('p-5', 'text-center', 'text-gray-600');
  });

  it('uses row index as key when data has no unique identifier', () => {
    const dataWithoutId = [
      { name: 'Test 1' },
      { name: 'Test 2' }
    ];
    
    render(<Table columns={[{ key: 'name', title: 'Name' }]} data={dataWithoutId} />);
    
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });
}); 