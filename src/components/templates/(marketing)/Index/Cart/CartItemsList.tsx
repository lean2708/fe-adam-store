'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { CartItemComponent } from './CartItem';

export interface CartItem {
  id: string;
  name: string;
  color: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  colorOptions: { value: string; label: string }[];
  sizeOptions: { value: string; label: string }[];
  selectedColor: string;
  selectedSize: string;
}

interface CartItemsListProps {
  items: CartItem[];
  onQuantityChange: (id: string, change: number) => void;
}

export function CartItemsList({ items, onQuantityChange }: CartItemsListProps) {
  return (
    <div className='lg:col-span-2 mb-24'>
      <div className='flex items-center gap-2 mb-2'>
        <Checkbox id='select-all' />
        <label htmlFor='select-all' className='text-primary font-normal '>
          Tất cả sản phẩm
        </label>
        <span className='ml-auto text-muted-foreground font-normal cursor-pointer hover:underline'>
          Xóa tất cả
        </span>
      </div>

      <div className='space-y-4'>
        {items.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </div>
  );
}
