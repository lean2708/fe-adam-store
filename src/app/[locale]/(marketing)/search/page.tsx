import { Suspense } from 'react';
import ContentSearch from '@/components/templates/(marketing)/search/ContentSearch';
import { HeaderSearch } from '@/components/templates/(marketing)/search/HeaderSearch';
import { SideSearch } from '@/components/templates/(marketing)/search/SideSearch';
import { searchAllProductsAction } from '@/actions/productActions';

// Price filter constants
const PRICE_FILTERS = [
  ['minPrice<500000'],
  ['minPrice>500000', 'minPrice<1000000'],
  ['minPrice>1000000'],
] as const;

// Optimized search data fetching
async function getSearchData(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  try {
    const query = searchParams.query
      ? decodeURIComponent(searchParams.query as string)
      : '';
    const color = searchParams.color ? Number(searchParams.color) : undefined;
    const minPrice = searchParams.minPrice
      ? Number(searchParams.minPrice)
      : undefined;
    const sort = searchParams.sort ? String(searchParams.sort) : 'desc';
    const page = searchParams.page ? Number(searchParams.page) : 0;

    // Build filters array
    const filters: string[] = [];
    if (color) filters.push(`colorId=${color}`);
    if (minPrice && minPrice >= 1 && minPrice <= 3) {
      filters.push(...PRICE_FILTERS[minPrice - 1]);
    }

    // Single API call with all parameters
    const res = await searchAllProductsAction(
      page,
      15,
      [`minPrice,${sort}`],
      query ? [`name~${query}`, ...filters] : filters
    );

    return {
      success: res.status === 200,
      totalProducts: res.data?.totalItems || 0,
      products: res.data?.items || [],
      totalPages: res.data?.totalPages || 0,
      currentPage: page,
      error: res.status !== 200 ? res.error : null,
    };
  } catch (error) {
    console.error('Search data fetch error:', error);
    return {
      success: false,
      totalProducts: 0,
      products: [],
      totalPages: 0,
      currentPage: 0,
      error: 'Failed to fetch search results',
    };
  }
}

function SearchLoading() {
  return (
    <div className='flex'>
      <div className='w-[15%] p-4'>
        <div className='animate-pulse space-y-4'>
          <div className='h-4 bg-gray-200 rounded w-3/4'></div>
          <div className='h-8 bg-gray-200 rounded'></div>
          <div className='h-8 bg-gray-200 rounded'></div>
        </div>
      </div>
      <div className='w-[85%] p-4'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/2'></div>
          <div className='grid grid-cols-5 gap-4'>
            {[...Array(10)].map((_, i) => (
              <div key={i} className='h-64 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Search content wrapper component
async function SearchContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchData = await getSearchData(searchParams);

  if (!searchData.success) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-red-500'>{'Có lỗi xảy ra khi tải dữ liệu'}</p>
      </div>
    );
  }

  return (
    <div className='flex'>
      <SideSearch totalProducts={searchData.totalProducts} />
      <div className='w-[85%]'>
        <ContentSearch
          initialProducts={searchData.products}
          totalProducts={searchData.totalProducts}
          totalPages={searchData.totalPages}
          currentPage={searchData.currentPage}
        />
      </div>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const searchKey = JSON.stringify(resolvedSearchParams);

  return (
    <>
      <HeaderSearch />
      <Suspense key={searchKey} fallback={<SearchLoading />}>
        <SearchContent searchParams={resolvedSearchParams} />
      </Suspense>
    </>
  );
}
