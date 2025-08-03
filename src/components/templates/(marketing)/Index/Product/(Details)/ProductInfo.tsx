import { TProduct, TVariant } from '@/types';
import { Star } from 'lucide-react';

export default function ProductInfo({
  product,
  selectVariant,
}: {
  product: TProduct;
  selectVariant: TVariant | undefined;
}) {
  return (
    <div className='space-y-2'>
      <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-primary'>
        {product.name}
      </h1>
      <div className='flex gap-2 text-xl'>
        <Star className='size-6 fill-amber-300 text-amber-200' />
        <span> {product.averageRating}.0</span>
        <span className='text-gray-400 ml-4'>
          Đã bán: {product.soldQuantity || 0}
        </span>
      </div>
      <div className='text-lg md:text-xl lg:text-2xl font-bold text-primary'>
        {(selectVariant?.price || 0).toLocaleString('vi-VN')} VNĐ
      </div>
    </div>
  );
}
