'use client';

import { getProductByCategoryAction } from '@/actions/categoryActions';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import ProductItem from './ProductItem';
import ProductCardSkeleton from '@/components/modules/ProductCardSkeleton';

export default function Products() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;
  const categoryId = searchParams.get('category') || '1';
  const sort = [`minPrice,${searchParams.get('sort')}`];

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', { page, size, sort, categoryId }],
    queryFn: () =>
      getProductByCategoryAction({ categoryId, page: page - 1, size, sort }),
  });

  if (!categoryId) {
    return <div>Vui lòng chọn danh mục sản phẩm.</div>;
  }

  if (isLoading) {
    return (
      <div className='grid  md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
        {Array.from({ length: 10 }, (_, i) => (
          <ProductCardSkeleton />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Đã xảy ra lỗi khi tải sản phẩm.</div>;
  }

  if (!data || !data.result?.items) {
    return <div>Không có sản phẩm nào.</div>;
  }

  return (
    data &&
    data.result &&
    data.result.items && (
      <div className='grid  md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
        {data.result?.items.map((product, index) => (
          <ProductItem product={product} key={index} />
        ))}
      </div>
    )
  );
}
