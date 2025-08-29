import { Checkbox } from '@/components/ui/checkbox';
import { useCartItem } from '@/hooks/(cart)/useCartItem';
import { cn, formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { TCartItem, TProduct } from '@/types';
import { Loader2, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import React from 'react';

function CartItemModal({
  cartItem,
  product,
  selected,
  onSelect,
}: {
  cartItem: TCartItem;
  product: Omit<TProduct, 'Category'>;
  selected: boolean;
  onSelect: () => void;
}) {
  const locale = useLocale();

  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const updateCartItem = useCartStore((state) => state.updateCartItem);

  const { price, onRemoveItem, isChanged } = useCartItem(
    cartItem,
    product,
    updateCartItem,
    removeCartItem
  );

  return (
    <div
      key={cartItem.id}
      className={cn(
        'flex items-start space-x-3 hover:bg-accent/40 p-2 rounded-sm transition-colors'
      )}
    >
      <div className='flex-shrink-0'>
        <Image
          src={cartItem.Product.mainImage || '/placeholder.svg'}
          alt={cartItem.Product.name || 'Product Image'}
          width={90}
          height={110}
          className='rounded-md object-cover'
        />
      </div>
      <div className='flex-1 grid grid-rows-2 gap-2'>
        <div className='min-w-0'>
          <h4 className='text-base font-bold text-primary truncate'>
            {cartItem.Product.name}
          </h4>
          <p className='text-sm font-medium text-muted-foreground'>
            {cartItem.color.name}/ {cartItem.size.name}
          </p>
        </div>

        <div className='mt-1'>
          <p className='text-base font-bold text-primary'>
            {formatCurrency(price || 0, locale)}
          </p>
          <p className='text-base text-primary'>x{cartItem.quantity}</p>
        </div>
      </div>
      <div className='flex flex-col items-center justify-between h-32'>
        <button className='p-1' onClick={onRemoveItem} disabled={isChanged}>
          {isChanged ? (
            <Loader2 className='h-4 w-4 text-muted-foreground animate-spin cursor-not-allowed' />
          ) : (
            <X className='h-4 w-4 text-muted-foreground hover:text-red-500' />
          )}
        </button>
        <Checkbox
          className='size-6'
          checked={selected}
          onCheckedChange={onSelect}
        />
      </div>
    </div>
  );
}

export default CartItemModal;
