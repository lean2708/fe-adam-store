'use client';
import { getProductByCategoryAction } from '@/actions/categoryActions';
import ProductCardIndex from '@/components/modules/ProductCardIndex';
import { transformProductResponseToTProduct } from '@/lib/data/transform/product';
import { TProduct } from '@/types';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagination from './Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import useIsMobile from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

export function ContentCategory() {
  const searchParams = useSearchParams();
  const paramCate = searchParams.get('category');
  const t = useTranslations('Marketing');
  const isMobile = useIsMobile();

  const [state, setState] = useState<{
    loading: boolean;
    value: string;
    page: number;
    maxPage: number;
    totalProducts: number;
    listProducts: TProduct[];
  }>({
    loading: true,
    value: 'desc',
    page: 0,
    maxPage: 0,
    totalProducts: 0,
    listProducts: [],
  });

  useEffect(() => {
    setState((ps) => ({ ...ps, page: 0 }));
  }, [paramCate]);

  useEffect(() => {
    const getProductByIdCategory = async (id: string) => {
      try {
        setState((ps) => ({ ...ps, loading: true }));
        const res = await getProductByCategoryAction(id, state.page, 12, [
          'minPrice,' + state.value,
        ]);
        if (res.status) {
          const items = res.data?.items || [];
          const newArrayProduct: TProduct[] = items.map((item) =>
            transformProductResponseToTProduct(item)
          );
          setState((ps) => ({
            ...ps,
            totalProducts: res.data?.totalItems || 0,
            listProducts: newArrayProduct,
            loading: false,
            maxPage: res.data?.totalPages || 1,
          }));
        }
      } catch (error) {
        setState((ps) => ({ ...ps, loading: false }));
      }
    };
    if (paramCate) getProductByIdCategory(paramCate);
  }, [paramCate, state.value, state.page]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState((ps) => ({ ...ps, value: event.target.value, page: 0 }));
  };

  return (
    <div className='w-full'>
      {/* Mobile: SideCategory sẽ được render ở đây */}
      <div className='md:hidden w-full'>
        {/* SideCategory component sẽ tự động render mobile view */}
      </div>

      <div
        className={cn(
          'w-full  items-center justify-end gap-2',
          isMobile ? 'h-16 hidden' : 'h-20 flex'
        )}
      >
        <p className='flex items-center gap-2'>
          <label
            htmlFor='sort'
            className='text-muted-foreground text-sm md:text-base'
          >
            Sắp xếp theo
          </label>
          <select
            className='outline-none border rounded px-2 py-1 text-sm md:text-base'
            value={state.value}
            onChange={handleSortChange}
            name='sort'
            id='sort'
          >
            <option value='asc'>Giá tăng dần</option>
            <option value='desc'>Giá giảm dần</option>
          </select>
        </p>
      </div>

      <div>
        <div className='w-full'>
          <div className='flex flex-wrap -mx-1'>
            {state.loading &&
              [1, 2, 3, 4].map((product) => (
                <div
                  key={product}
                  className='basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 mb-4 px-1'
                >
                  <Skeleton className='aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3'></Skeleton>
                  <div className='flex items-center gap-2 mb-3'>
                    {[1, 2, 3].map((color) => (
                      <Skeleton
                        key={color}
                        style={{
                          width: '50px',
                          height: '29px',
                          borderRadius: '100px',
                          opacity: 1,
                        }}
                      />
                    ))}
                  </div>
                  <Skeleton className='h-6 w-full mb-3'></Skeleton>
                  <Skeleton className='h-6 w-[45%]'></Skeleton>
                </div>
              ))}
            {!state.loading &&
              state.listProducts.map((product) => (
                <div
                  key={product.id}
                  className='basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 mb-4 px-1'
                >
                  <ProductCardIndex
                    product={product}
                    badgeText={t('bestSellers.badgeText')}
                    className='px-1'
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      <Pagination
        totalPage={state.maxPage}
        page={state.page}
        totalProduct={state.totalProducts}
        onChangePage={(val) => setState((ps) => ({ ...ps, page: val - 1 }))}
      />
    </div>
  );
}
