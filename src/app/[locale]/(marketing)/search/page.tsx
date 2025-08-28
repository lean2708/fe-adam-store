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

// Loading component chỉ cho ContentSearch area
function ContentLoading() {
  return (
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
  );
}

// Separate component chỉ cho ContentSearch với loading riêng
async function ContentSearchWrapper({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchData = await getSearchData(searchParams);

  if (!searchData.success) {
    return (
      <div className='w-[85%] flex items-center justify-center h-64'>
        <p className='text-red-500'>Có lỗi xảy ra khi tải dữ liệu</p>
      </div>
    );
  }

  return (
    <div className='w-[85%]'>
      <ContentSearch
        initialProducts={searchData.products}
        totalProducts={searchData.totalProducts}
        totalPages={searchData.totalPages}
        currentPage={searchData.currentPage}
      />
    </div>
  );
}

// Static component cho SideSearch - không cần re-fetch
async function StaticSideSearch({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Fetch initial data để có totalProducts cho lần đầu
  const initialData = await getSearchData(searchParams);

  return <SideSearch totalProducts={initialData.totalProducts} />;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Tạo key riêng cho ContentSearch - chỉ phần này re-mount
  const contentKey = JSON.stringify({
    query: resolvedSearchParams.query,
    color: resolvedSearchParams.color,
    minPrice: resolvedSearchParams.minPrice,
    sort: resolvedSearchParams.sort,
    page: resolvedSearchParams.page,
  });

  return (
    <div className='adam-store-bg-light'>
      <HeaderSearch />
      <div className='flex'>
        {/* SideSearch không bị re-mount, luôn hiển thị */}
        <StaticSideSearch searchParams={resolvedSearchParams} />

        {/* Chỉ ContentSearch bị loading khi filter thay đổi */}
        <Suspense key={contentKey} fallback={<ContentLoading />}>
          <ContentSearchWrapper searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}
