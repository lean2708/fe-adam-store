'use client';

import { UseQueryResult } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import ProductItme from './ProductItem';
import ProductCardSkeleton from '@/components/modules/ProductCardSkeleton';
import { ApiResponsePageResponseProductResponse } from '@/api-client';
import { transformProductResponseToTProduct } from '@/lib/data/transform/product';

export default function Products({
  query,
}: {
  query: UseQueryResult<ApiResponsePageResponseProductResponse, unknown>;
}) {
  const { data, isLoading, error } = query;
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') || '1';

  if (!categoryId) {
    return <div>Vui lòng chọn danh mục sản phẩm.</div>;
  }

  if (isLoading) {
    return (
      <div className='grid  md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
        {Array.from({ length: 10 }, (_, i) => (
          <ProductCardSkeleton key={i} />
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
        {data.result?.items.map((product) => (
          <ProductItme
            product={transformProductResponseToTProduct(product)}
            key={product.id}
          />
        ))}
      </div>
    )
  );
}
