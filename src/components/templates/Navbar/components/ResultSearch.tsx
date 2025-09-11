'use client';

import { useState, useEffect, useCallback } from 'react';

export default function SearchResult(props: { searchQuery: string }) {
  const { searchQuery } = props;
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // debounce input 1s
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // gọi API khi query thay đổi
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
  }, [debouncedQuery]);

  if (!searchQuery) return null;

  return (
    <div className='absolute top-16 left-0 w-full bg-white shadow-lg rounded-md p-4 z-[10000]'>
      {loading && <p className='text-gray-500'>Đang tìm kiếm...</p>}

      {!loading && results.length === 0 && (
        <p className='text-gray-500'>Không tìm thấy kết quả nào</p>
      )}

      {!loading && results.length > 0 && (
        <ul className='space-y-2'>
          {results.map((item) => (
            <li
              key={item.id}
              className='p-2 hover:bg-gray-100 rounded cursor-pointer'
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
