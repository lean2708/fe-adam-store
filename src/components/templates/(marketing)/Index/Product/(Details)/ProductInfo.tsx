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
    <div className='space-y-1'>
      <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-primary'>
        {product.name}
      </h1>
      <div className='flex gap-2'>
        <Star className='size-5 fill-amber-300 text-amber-200' />
        <span> {product.averageRating}.0</span>
        <span className='text-gray-400 ml-4'>
          Đã bán: {product.soldQuantity || 0}
        </span>
      </div>
      <div className='text-xl md:text-2xl lg:text-3xl font-bold text-primary'>
        {selectVariant?.price || 0} ₫
      </div>
    </div>
  );
}
