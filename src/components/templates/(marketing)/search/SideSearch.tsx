'use client';
import { fetchAllColorsAction } from '@/actions/colorActions';
import { cn } from '@/lib/utils';
import { TColor } from '@/types';
import { ChevronRight, Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const priceOptions = [
  { id: 1, name: 'Dưới 500,000' },
  { id: 2, name: '500,000 - 1,000,000' },
  { id: 3, name: 'Trên 1,000,000' },
];

const FilterContent = ({
  state,
  updateQuery,
}: {
  state: {
    loading: boolean;
    minPrice?: number;
    colorSort?: number;
    listColor: TColor[];
  };
  updateQuery: (key: string, value?: string | number) => void;
}) => {
  return (
    <>
      <details
        open={!state.loading}
        className='group w-full adam-store-bg-light'
      >
        <summary className='h-14 w-full px-4 md:px-8 border-b border-t border-[#dddddd] outline-none cursor-pointer list-none flex justify-between items-center'>
          Màu
          <ChevronRight className='transition-transform group-open:rotate-90' />
        </summary>

        <ul className='w-full px-4 md:px-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2 adam-store-bg'>
          {state.listColor.length !== 0 &&
            !state.loading &&
            state.listColor.map((color: TColor) => (
              <li
                onClick={() => {
                  const newValue =
                    color.id === state.colorSort ? undefined : color.id;
                  updateQuery('color', newValue);
                }}
                key={color.id}
                className='flex flex-col items-center px-2 py-2 cursor-pointer'
              >
                <button
                  className={cn(
                    'px-6 py-3 rounded-full border border-[#888888] transition-all duration-200 hover:scale-110 hover:shadow-md',
                    state.colorSort === color.id &&
                      'outline outline-offset-3 outline-accent-foreground shadow-lg scale-105'
                  )}
                  style={{ backgroundColor: color.name }}
                ></button>
                <span
                  className={cn(
                    'select-none mt-1 text-center text-sm transition-all duration-200',
                    state.colorSort === color.id
                      ? 'font-semibold text-accent-foreground'
                      : 'text-muted-foreground hover:text-accent-foreground'
                  )}
                >
                  {color.name}
                </span>
              </li>
            ))}
        </ul>
      </details>

      <details open className='group w-full adam-store-bg-light'>
        <summary className='h-14 w-full px-4 md:px-8 border-b border-t border-[#dddddd] outline-none cursor-pointer flex justify-between items-center'>
          Giá
          <ChevronRight className='transition-transform group-open:rotate-90' />
        </summary>
        <ul className='adam-store-bg text-muted-foreground font-bold opacity-0 transition-all duration-500 group-open:min-h-40 group-open:opacity-100'>
          {priceOptions.map((item) => (
            <li
              onClick={() => {
                const newValue =
                  item.id === state.minPrice ? undefined : item.id;
                updateQuery('minPrice', newValue);
              }}
              className='flex px-4 md:px-8 py-4 hover:opacity-45 duration-500 cursor-pointer'
              key={item.id}
            >
              <span
                className={`relative inline-block w-5 h-5 mr-2 border-2 border-[#4b4b4b6e] rounded ${
                  item.id === state.minPrice && 'border-black'
                }`}
              >
                {item.id === state.minPrice && (
                  <svg
                    className='absolute inset-0 w-full h-full bg-black text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                )}
              </span>
              {item.name}
            </li>
          ))}
        </ul>
      </details>
    </>
  );
};

export function SideSearch({ totalProducts }: { totalProducts: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<{
    loading: boolean;
    minPrice?: number;
    colorSort?: number;
    listColor: TColor[];
  }>({
    loading: true,
    minPrice: searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    colorSort: searchParams.get('color')
      ? Number(searchParams.get('color'))
      : undefined,
    listColor: [],
  });

  useEffect(() => {
    setState((ps) => ({
      ...ps,
      minPrice: searchParams.get('minPrice')
        ? Number(searchParams.get('minPrice'))
        : undefined,
      colorSort: searchParams.get('color')
        ? Number(searchParams.get('color'))
        : undefined,
    }));
  }, [searchParams]);

  useEffect(() => {
    const getColor = async () => {
      try {
        setState((ps) => ({ ...ps, loading: true }));
        const res = await fetchAllColorsAction();
        if (res.success) {
          setState((ps) => ({ ...ps, listColor: res.data || [] }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setState((ps) => ({ ...ps, loading: false }));
      }
    };
    getColor();
  }, []);

  const updateQuery = (key: string, value?: string | number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === undefined) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {/* Mobile Header với Drawer Trigger */}
      <div className='md:hidden flex justify-between items-center w-full py-4 px-2 adam-store-bg-light'>
        <span className='text-[#888888]'>{totalProducts} kết quả</span>

        <Sheet>
          <SheetTrigger asChild>
            <div className='flex items-center cursor-pointer touch-auto gap-2'>
              Bộ lọc
              <Filter size={16} />
            </div>
          </SheetTrigger>
          <SheetContent side='right' className='w-[85%] max-w-sm'>
            <SheetHeader className='mb-4'>
              <SheetTitle>Bộ lọc</SheetTitle>
              <SheetDescription>Lọc sản phẩm theo tiêu chí</SheetDescription>
            </SheetHeader>
            <FilterContent state={state} updateQuery={updateQuery} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className='hidden md:block w-[15%] adam-store-bg-light'>
        <div className='h-14 flex w-full justify-between items-center px-8'>
          <p>Bộ lọc</p>
          <span className='text-[#888888]'>{totalProducts} kết quả</span>
        </div>
        <FilterContent state={state} updateQuery={updateQuery} />
      </div>
    </>
  );
}
