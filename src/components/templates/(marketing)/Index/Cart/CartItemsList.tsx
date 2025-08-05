'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { CartItem } from './CartItem/CartItem';
import { useEffect, useState } from 'react';
import { fetchCartItemsAction } from '@/actions/cartActions';
import { useCartStore } from '@/stores/cartStore';
import EmptyCart from './EmptyCart';

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

export function CartItemsList({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);

  useEffect(() => {
    const fetchCartItems = async () => {
      const res = await fetchCartItemsAction();
      setCartItems(res.success ? res.data ?? [] : []);
      setIsLoading(false);
    };

    fetchCartItems();
  }, [userId, setCartItems]);

  console.log('Cart items:', cartItems);

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
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
            {cartItems.map((item) => (
              <CartItem key={item.id} cartItem={item} product={item.Product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
