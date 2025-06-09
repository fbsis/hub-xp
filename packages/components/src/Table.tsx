import React from 'react';

interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
}

export function Table({ columns, data, loading = false }: TableProps) {
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        No data available
      </div>
    );
  }

  return (
    <table style={{ 
      width: '100%', 
      borderCollapse: 'collapse',
      border: '1px solid #ddd'
    }}>
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          {columns.map((column) => (
            <th
              key={column.key}
              style={{
                padding: '12px',
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                fontWeight: '600'
              }}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr 
            key={index}
            style={{
              borderBottom: '1px solid #eee'
            }}
          >
            {columns.map((column) => (
              <td
                key={column.key}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                }}
              >
                {column.render 
                  ? column.render(record[column.key], record)
                  : record[column.key]
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
} 