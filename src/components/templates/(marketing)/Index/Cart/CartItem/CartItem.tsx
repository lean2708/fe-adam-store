// components/CartItem.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { roboto } from '@/config/fonts';
import { TCartItem, TEntityBasic, TProduct } from '@/types';
import Sizes from './Sizes';
import Colors from './Colors';
import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';
import { useCartItem } from '@/hooks/(cart)/useCartItem';
import Quantity from './Quanity';

type ProductProps = {
  cartItem: TCartItem;
  product: Omit<TProduct, 'Category'>;
};

export function CartItem({ cartItem, product }: ProductProps) {
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isImageError, setImageError] = useState(false);
  const isExternalImage = product.mainImage?.startsWith('http');

  const {
    selectedSizeName,
    quantity,
    isQuantityUpdating,
    isChanged,
    maxQuantity,
    currentColor,
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
          <Checkbox className='my-auto' />
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
                  Màu sắc: {cartItem.color}
                </p>
              </div>

              <div className='text-right'>
                <p className='text-sm text-primary font-normal mb-1'>
                  {cartItem.quantity}
                </p>
                <p className='font-bold text-primary mb-2'>VNĐ</p>
              </div>
            </div>

            <div className='flex gap-4 mb-2 -mt-2'>
              <Colors
                cartItemId={cartItem.id}
                color={currentColor?.name ?? cartItem.color}
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
                  className='flex justify-center items-center group'
                  disabled={isChanged || isQuantityUpdating}
                >
                  {isChanged || isQuantityUpdating ? (
                    <Loader2 className='size-5 mr-1 text-muted-foreground animate-spin' />
                  ) : (
                    <>
                      <Trash2 className=' cursor-pointer size-5 mr-1 text-muted-foreground group-hover:text-destructive' />
                      <span className=' cursor-pointer text-muted-foreground font-medium group-hover:text-destructive group-hover:underline'>
                        Xóa
                      </span>
                    </>
                  )}
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
