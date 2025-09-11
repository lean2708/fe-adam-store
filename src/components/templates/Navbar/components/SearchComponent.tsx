'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchInput from '@/components/ui/search-input';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// *Dynamic modals
const SearchModal = dynamic(() => import('../modal/SearchModal'), {
  ssr: false,
});

interface SearchComponentProps {
  onSearchExpand?: (expanded: boolean) => void;
}

export default function SearchComponent({
  onSearchExpand,
}: SearchComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('query');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const expandedSearchRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // đồng bộ value từ URL khi ở trang search
  useEffect(() => {
    const queryNew = searchParams.get('query');
    const decoded = queryNew ? decodeURIComponent(queryNew) : '';
    setSearchValue(decoded);
  }, [searchParams]);

  // debounce input
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchValue]);

  const handleSearchExpand = useCallback(
    (expanded: boolean) => {
      setIsSearchExpanded(expanded);
      onSearchExpand?.(expanded);
    },
    [onSearchExpand]
  );
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!isSearchExpanded) return;
      const target = event.target as Element;
      if (searchRef.current?.contains(target)) return;
      if (expandedSearchRef.current?.contains(target)) return;
      const searchModal = document.querySelector('[data-search-modal]');
      if (searchModal?.contains(target)) return;

      handleSearchExpand(false);
      if (!query) {
        setSearchValue('');
      }

      setSearchModalOpen(false);
    },
    [isSearchExpanded, handleSearchExpand, query]
  );
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // đóng modal → đóng luôn input
  const handleSearchModalClose = useCallback(() => {
    setSearchModalOpen(false);
    handleSearchExpand(false);
  }, [handleSearchExpand]);

  // xử lý khi input thay đổi
  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (query !== null) {
      // đang ở trang search → update url luôn
      router.push(`/search?query=${encodeURIComponent(value)}`);
    } else {
      // không ở trang search → có ký tự thì mở modal
      if (value.trim().length > 0) {
        setSearchModalOpen(true);
        handleSearchExpand(true);
      } else {
        setSearchModalOpen(false);
      }
    }
  };

  return (
    <>
      {/* Expanded Search */}
      {isSearchExpanded && (
        <div
          ref={expandedSearchRef}
          data-search-expanded
          className={cn(
            'w-full flex items-center justify-center h-16 absolute inset-0 z-[9999]',
            'transition-all duration-300 ease-out transform will-change-transform',
            isSearchExpanded
              ? 'opacity-100 scale-100 translate-y-0 bg-white dark:bg-gray-900'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none bg-transparent'
          )}
        >
          <div className='w-full px-4 sm:px-6 lg:px-8'>
            <div className='max-w-2xl mx-auto'>
              <SearchInput
                variant='expanded'
                value={searchValue}
                onChange={handleSearchChange}
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isSearchExpanded && (
        <div
          className='fixed inset-0 bg-black/20 z-40'
          onClick={() => handleSearchExpand(false)}
        />
      )}

      {/* Desktop Search */}
      <div
        className='hidden sm:flex absolute right-40 top-0 h-16 items-center z-20'
        ref={searchRef}
      >
        <SearchInput
          variant='pill'
          value={searchValue}
          onChange={handleSearchChange}
          onClick={() => handleSearchExpand(true)}
          onFocus={() => handleSearchExpand(true)}
          className='w-[250px] md:w-[150px] lg:w-[200px] xl:w-[250px] 2xl:w-[280px]'
        />
      </div>

      {/* Mobile Search */}
      <Button
        variant='ghost'
        aria-label='Search'
        size='sm'
        className='sm:hidden absolute right-40 top-0 h-16 items-center z-20'
        onClick={() => {
          setSearchModalOpen(true);
          handleSearchExpand(true);
        }}
      >
        <Search className='h-4 w-4' />
      </Button>

      {/* Modal */}
      {searchModalOpen && query === null && (
        <SearchModal
          open={searchModalOpen}
          onClose={handleSearchModalClose}
          searchQuery={debouncedSearchValue}
          isSearchExpanded={isSearchExpanded}
        />
      )}
    </>
  );
}
