'use client';
import { searchAllProductsAction } from '@/actions/productActions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagination from '../detail/Pagination';
import { TProduct } from '@/types';
import ProductCardIndex from '@/components/modules/ProductCardIndex';
import { useTranslations } from 'next-intl';
import { ProductCardWithColorsSkeleton } from '@/components/ui/skeleton';
const priceFilters = [
  [`minPrice<500000`],
  [`minPrice>500000`, `minPrice<1000000`],
  [`minPrice>1000000`],
];
export default function ContentSearch({
  initialProducts = [],
  totalProducts: initialTotalProducts = 0,
  totalPages: initialTotalPages = 0,
  currentPage: initialCurrentPage = 0,
}: {
  initialProducts?: TProduct[];
  totalProducts?: number;
  totalPages?: number;
  currentPage?: number;
}) {
  const t = useTranslations('Marketing');
  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  const [state, setState] = useState<{
    loading: boolean;
    color?: number;
    minPrice?: number;
    sort?: string;
    page: number;
    totalPage: number;
    totalProduct: number;
    listProducts: TProduct[];
    isInitialLoad: boolean;
  }>({
    loading: false,
    minPrice: searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    color: searchParams.get('color')
      ? Number(searchParams.get('color'))
      : undefined,
    sort: searchParams.get('sort') ? String(searchParams.get('sort')) : 'desc',
    page: initialCurrentPage,
    totalPage: initialTotalPages,
    totalProduct: initialTotalProducts,
    listProducts: initialProducts,
    isInitialLoad: true,
  });

  // Update filters when search params change
  useEffect(() => {
    const color = searchParams.get('color')
      ? Number(searchParams.get('color'))
      : undefined;
    const minPrice = searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined;
    const sort = searchParams.get('sort') ?? 'desc';

    setState((ps) => ({
      ...ps,
      color,
      minPrice,
      sort,
      page: 0, // Reset to first page when filters change
      isInitialLoad: false,
    }));
  }, [searchParams]);

  // Search products when filters or page changes
  useEffect(() => {
    const searchProduct = async () => {
      try {
        setState((ps) => ({ ...ps, loading: true }));

        const filters: string[] = [];
        if (state.color) filters.push(`colorId=${state.color}`);
        if (state.minPrice) filters.push(...priceFilters[state.minPrice - 1]);

        const searchFilters = query ? [`name~${query}`, ...filters] : filters;

        const res = await searchAllProductsAction(
          state.page,
          15,
          [`minPrice,${state.sort}`],
          searchFilters
        );

        if (res.status === 200) {
          setState((ps) => ({
            ...ps,
            totalPage: res.data?.totalPages || 0,
            totalProduct: res.data?.totalItems || 0,
            listProducts: res.data?.items || [],
          }));
        }
      } catch (error) {
        console.log('Search error:', error);
        setState((ps) => ({
          ...ps,
          listProducts: [],
          totalPage: 0,
          totalProduct: 0,
        }));
      } finally {
        setState((ps) => ({ ...ps, loading: false }));
      }
    };

    // Skip initial load if we have initial data, otherwise search
    if (
      !state.isInitialLoad ||
      (state.isInitialLoad && initialProducts.length === 0)
    ) {
      searchProduct();
    }
  }, [
    state.page,
    state.minPrice,
    state.color,
    state.sort,
    state.isInitialLoad,
    query,
    initialProducts.length,
  ]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setState((ps) => ({
      ...ps,
      page: newPage - 1, // Convert to 0-based index
      isInitialLoad: false,
    }));

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className='flex flex-wrap'>
      {Array.from({ length: 15 }, (_, i) => (
        <div key={i} className='basis-1/2 md:basis-1/3 lg:basis-1/5 mb-2 p-2'>
          <ProductCardWithColorsSkeleton />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className='w-full '>
        <div className='flex flex-wrap min-h-[400px]'>
          {state.loading ? (
            <LoadingSkeleton />
          ) : state.listProducts.length === 0 ? (
            <div className='w-full flex items-center justify-center py-16'>
              <div className='text-center space-y-4'>
                <div className='text-6xl'>🔍</div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                  {t('noProductsFound') || 'Không tìm thấy sản phẩm'}
                </h3>
                <p className='text-gray-500 dark:text-gray-400'>
                  {query
                    ? `Không có sản phẩm nào phù hợp với "${query}"`
                    : 'Thử thay đổi bộ lọc để xem thêm sản phẩm'}
                </p>
              </div>
            </div>
          ) : (
            state.listProducts.map((product, index) => (
              <div
                key={product.id}
                className='basis-1/2 md:basis-1/3 lg:basis-1/5 mb-2'
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
                  <ProductCardIndex
                    product={product}
                    badgeText={t('bestSellers.badgeText')}
                    className=' px-2'
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Only show pagination if there are products and more than 1 page */}
      {state.listProducts.length > 0 && state.totalPage > 1 && (
        <Pagination
          totalPage={state.totalPage}
          page={state.page}
          totalProduct={state.totalProduct}
          onChangePage={handlePageChange}
        />
      )}
    </>
  );
}
