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
      <div className="p-5 text-center">
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-5 text-center text-gray-600">
        No data available
      </div>
    );
  }

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((column) => (
            <th
              key={column.key}
              className="p-3 text-left border-b border-gray-300 font-semibold"
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
            className="border-b border-gray-200 hover:bg-gray-50"
          >
            {columns.map((column) => (
              <td
                key={column.key}
                className="p-3 border-b border-gray-200"
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