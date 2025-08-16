import { formatCurrency } from '@/lib/utils';
import { TProductVariant } from '@/types';
import Image from 'next/image';

export function ProductItem({ product }: { product: TProductVariant }) {
  return (
    <div className='flex gap-4'>
      <Image
        width={134}
        height={180}
        src={product.imageUrl || '/placeholder.svg'}
        alt={product.name || 'Product Item'}
        className='w-32 h-44 object-cover rounded-lg'
        loading='lazy'
      />
      <div className='flex-1'>
        <h4 className='font-bold text-primary mb-1 line-clamp-1'>
          {product.name}
        </h4>
        <p className='text-sm text-muted-foreground mb-1'>
          Màu sắc: {product.color?.name}
        </p>
        <p className='text-sm text-muted-foreground mb-1'>
          Kích cỡ: {product.size?.name}
        </p>
        <p className='text-sm text-muted-foreground'>
          Số lượng: {product.quantity}
        </p>
      </div>
      <div className='text-right'>
        <p className='font-bold text-primary'>
          {formatCurrency(product.price || 0)}
        </p>
      </div>
    </div>
  );
}
