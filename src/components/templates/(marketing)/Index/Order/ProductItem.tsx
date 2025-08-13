import { useCartItem } from '@/hooks/(cart)/useCartItem';
import { formatCurrency } from '@/lib/utils';
import { TCartItem, TProduct } from '@/types';
import Image from 'next/image';

export function ProductItem({ product }: { product: TCartItem }) {
  const { totalPrice } = useCartItem(product, product.Product);

  return (
    <div className='flex gap-4'>
      <Image
        width={134}
        height={180}
        src={product.Product.mainImage || '/placeholder.svg'}
        alt={product.Product.name || 'Product Item'}
        className='w-32 h-44 object-cover rounded-lg'
        loading='lazy'
      />
      <div className='flex-1'>
        <h4 className='font-bold text-primary mb-1 line-clamp-1'>
          {product.Product.name}
        </h4>
        <p className='text-sm text-muted-foreground mb-1'>
          Màu sắc: {product.color}
        </p>
        <p className='text-sm text-muted-foreground mb-1'>
          Kích cỡ: {product.size}
        </p>
        <p className='text-sm text-muted-foreground'>
          Số lượng: {product.quantity}
        </p>
      </div>
      <div className='text-right'>
        <p className='font-bold text-primary'>{formatCurrency(totalPrice)}</p>
      </div>
    </div>
  );
}
