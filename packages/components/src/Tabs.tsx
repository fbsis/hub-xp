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
      <div className="border-b border-gray-300 mb-5">
        <div className="flex gap-0">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`
                px-6 py-3 border-none bg-transparent cursor-pointer text-sm font-medium
                transition-all duration-200 border-b-2
                ${activeKey === item.key 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 border-transparent hover:text-blue-500'
                }
              `}
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
            className={activeKey === item.key ? 'block' : 'hidden'}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
} 