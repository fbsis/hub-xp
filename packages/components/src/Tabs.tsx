import React, { useState } from 'react';

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
}

export function Tabs({ items, defaultActiveKey }: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || items[0]?.key);

  return (
    <div>
      {/* Tab Headers */}
      <div style={{
        borderBottom: '1px solid #ddd',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '0'
        }}>
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: activeKey === item.key ? '#007bff' : '#666',
                borderBottom: activeKey === item.key ? '2px solid #007bff' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {items.map((item) => (
          <div
            key={item.key}
            style={{
              display: activeKey === item.key ? 'block' : 'none'
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
} 