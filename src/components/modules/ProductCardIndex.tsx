import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLocale } from 'next-intl';

import { TProduct } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { SIZE_LIST } from '@/lib/constants';
import { Button } from '../ui/button';
import useProductDetails from '@/hooks/(product_details)/useProductDetails';

interface ProductCardIndexProps {
  product: TProduct;
  badgeText?: string;
  className?: string;
}

export default function ProductCardIndex({
  product,
  badgeText = 'Mới',
  className = '',
}: ProductCardIndexProps) {
  const locale = useLocale();

  const [colorSelected, setColorSelected] = useState<number | undefined>(
    undefined
  );
  const [sizeSelected, setSizeSelected] = useState<number | undefined>(
    undefined
  );

  const { onChangeColor, onChangeSize, handleAddToCart, selectedColor } =
    useProductDetails(product);

  const handleColorClick = (colorId: number | undefined) => {
    setColorSelected(colorId);
    setSizeSelected(undefined);
    onChangeColor(colorId);
    onChangeSize(undefined);
  };

  const handleSizeClick = (sizeId: number | undefined) => {
    setSizeSelected(sizeId);
    onChangeSize(sizeId);
  };

  const handleAddToCartClick = async () => {
    await handleAddToCart();
  };

  const variantList =
    product.colors?.find((c) => c.id === colorSelected)?.variants || [];
  const defaultPrice = product.colors?.[0]?.variants?.[0]?.price || 0;

  return (
    <div className={cn('group relative cursor-pointer', className)}>
      {/* Product Image Container */}
      <div className='relative mb-4 aspect-[3/4] overflow-hidden rounded-xl bg-gray-50'>
        <Link href={`/product/${product.id}`} className='block h-full w-full'>
          <Image
            src={
              product.mainImage ||
              'https://images.pexels.com/photos/6069525/pexels-photo-6069525.jpeg?auto=compress&cs=tinysrgb&h=400&w=300placeholder-product.jpg'
            }
            alt={product.name || 'Product image'}
            width={300}
            height={400}
            className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
          />

          {/* Badge */}
          {badgeText && (
            <div className='absolute right-3 top-3 z-10'>
              <span className='rounded-full bg-black px-3 py-1 text-xs font-medium text-white shadow-lg'>
                {badgeText}
              </span>
            </div>
          )}
        </Link>

        {/* Hover Panel */}
        <div className='absolute bottom-0 left-0 right-0 translate-y-full transform adam-store-bg-light p-4 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:-translate-y-0 rounded-t-xl border-t border-secondary shadow-xl'>
          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCartClick}
            className='mb-3 w-full  py-3 text-sm font-medium'
          >
            Thêm vào giỏ hàng +
          </Button>

          {/* Size Selection */}
          {colorSelected && (
            <div className='flex flex-wrap justify-center gap-2'>
              {SIZE_LIST.map((size) => {
                const variant = variantList.find(
                  (v) => v.size?.name === size.name
                );
                const isAvailable = variant && variant.quantity! > 0;
                const isSelected = variant?.size?.id === sizeSelected;

                return (
                  <Button
                    key={size.key}
                    size='sm'
                    disabled={!isAvailable}
                    onClick={() =>
                      isAvailable && handleSizeClick(variant.size?.id)
                    }
                    className={cn(
                      'h-8 min-w-[2.5rem] rounded-full border px-3 text-xs font-medium transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground '
                        : isAvailable
                        ? 'border-border adam-store-bg text-muted-foreground hover:border-secondary hover:bg-accent hover:scale-110'
                        : 'border-border bg-muted-foreground text-muted line-through opacity-60 cursor-not-allowed'
                    )}
                  >
                    {size.name}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Color Selection */}
      <div className='mb-3 flex items-center gap-2'>
        {product.colors?.map((color) => (
          <button
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            className={cn(
              'h-7 w-12 rounded-full border-2 transition-all duration-200 hover:scale-110',
              color.id === selectedColor
                ? 'border-gray-800 ring-2 ring-gray-800 ring-offset-2'
                : 'border-gray-300 hover:border-gray-400'
            )}
            style={{ backgroundColor: color.name }}
            aria-label={`Select color ${color.name}`}
          />
        ))}
      </div>

      {/* Product Info */}
      <div className='space-y-2'>
        <Link href={`product/${product.id}`}>
          <h3 className='text-sm font-medium uppercase tracking-wide text-gray-900 transition-colors hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300'>
            {product.title}
          </h3>
        </Link>

        <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
          {formatCurrency(defaultPrice, locale)}
        </p>
      </div>
    </div>
  );
}
