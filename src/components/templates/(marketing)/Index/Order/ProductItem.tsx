import { formatCurrency } from '@/lib/utils';
import { TProductVariant } from '@/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function ProductItem({ product }: { product: TProductVariant }) {
  const t = useTranslations('Order.product_list');

  return (
    <div className='flex gap-4'>
      <Image
        width={134}
        height={180}
        src={product.imageUrl || '/placeholder.svg'}
        alt={product.name || 'Product Item'}
        className='w-32 h-44 object-cover rounded-lg'
        loading='lazy'
        unoptimized
      />
      <div className='flex-1'>
        <h4 className='font-bold text-primary mb-1 line-clamp-1'>
          {product.name}
        </h4>
        <p className='text-sm text-muted-foreground mb-1'>
          {t('color')}: {product.color?.name}
        </p>
        <p className='text-sm text-muted-foreground mb-1'>
          {t('size')}: {product.size?.name}
        </p>
        <p className='text-sm text-muted-foreground'>
          {t('quanity')}: {product.quantity}
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
