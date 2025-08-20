// components/CartItem.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { cn, formatCurrency } from '@/lib/utils';
import { roboto } from '@/config/fonts';
import { TCartItem, TEntityBasic, TProduct } from '@/types';
import Sizes from './Sizes';
import Colors from './Colors';
import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';
import { useCartItem } from '@/hooks/(cart)/useCartItem';
import Quantity from './Quanity';
import { useLocale, useTranslations } from 'next-intl';

type ProductProps = {
  cartItem: TCartItem;
  product: Omit<TProduct, 'Category'>;
  selected: boolean;
  onSelect: () => void;
};

export function CartItem({
  cartItem,
  product,
  selected,
  onSelect,
}: ProductProps) {
  const t = useTranslations('Header');
  const locale = useLocale();

  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);

  const [isImageError, setImageError] = useState(false);
  const isExternalImage = product.mainImage?.startsWith('http');

  const {
    selectedSizeName,
    quantity,
    isQuantityUpdating,
    isChanged,
    maxQuantity,
    totalPrice,
    currentColor,
    price,
    onChangeColor,
    onChangeSize,
    onRemoveItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCartItem(cartItem, product, updateCartItem, removeCartItem);

  return (
    <Card className='border-border border-b-2 first:border-t-2'>
      <CardContent className='py-4 px-0 relative'>
        <div className='flex gap-4'>
          <Checkbox
            className='my-auto'
            checked={selected}
            onCheckedChange={onSelect}
          />
          <Image
            src={
              isExternalImage && !isImageError
                ? product.mainImage
                : `/images/no-image.jpg`
            }
            alt={cartItem.Product.name || 'Product Image'}
            width={135}
            height={180}
            className='rounded-lg object-cover'
            onError={() => setImageError(true)}
            unoptimized
          />
          <div className='grid grid-rows-3 w-full'>
            <div className='flex justify-between'>
              <div>
                <h3 className='font-bold text-primary mb-1'>
                  {cartItem.Product.name}
                </h3>
                <p
                  className={cn(
                    `text-sm text-muted-foreground mb-2`,
                    roboto.className
                  )}
                >
                  {t('cart.color')} / {t('cart.size')}
                </p>
              </div>

              <div className='text-right'>
                <p className='text-sm text-primary font-normal mb-1'>
                  {formatCurrency(price || 0, locale)} × {cartItem.quantity}
                </p>

                <p className='font-bold text-primary mb-2'>
                  {formatCurrency(totalPrice, locale)}
                </p>
              </div>
            </div>

            <div className='flex gap-4 mb-2 -mt-2'>
              <Colors
                cartItemId={cartItem.id}
                color={currentColor?.name ?? cartItem.color.name ?? ''}
                productColors={product.colors ?? []}
                onChangeColor={onChangeColor}
                isChanging={isChanged}
              />

              <Sizes
                cartItemId={cartItem.id}
                size={selectedSizeName ?? ''}
                productSizes={
                  currentColor?.variants
                    ?.map((v) => v.size)
                    .filter((size): size is TEntityBasic => !!size) ?? []
                }
                onChangeSize={onChangeSize}
                isChanging={isChanged}
              />
            </div>

            <div className='flex items-end-safe justify-between'>
              <div className='flex justify-center items-center'>
                <button
                  onClick={onRemoveItem}
                  className={cn(
                    'flex justify-center items-center group',
                    isChanged || isQuantityUpdating
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  )}
                  disabled={isChanged || isQuantityUpdating}
                >
                  <Trash2 className='  size-5 mr-1 text-muted-foreground group-hover:text-destructive' />
                  <span className='  text-muted-foreground font-medium group-hover:text-destructive group-hover:underline'>
                    {t('cart.remove')}
                  </span>
                </button>
              </div>

              <Quantity
                quantity={quantity}
                maxQuantity={maxQuantity}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                isUpdating={isQuantityUpdating}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
