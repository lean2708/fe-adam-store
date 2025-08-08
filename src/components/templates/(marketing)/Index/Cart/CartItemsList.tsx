'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { CartItem } from './CartItem/CartItem';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import EmptyCart from './EmptyCart';
import ClearCartButton from './CartItemsList/ClearItemsButton';
import { Label } from '@/components/ui/label';

export function CartItemsList({ userId }: { userId: string }) {
  const cartItems = useCartStore((s) => s.cartItems);
  const selectedItems = useCartStore((s) => s.selectedItems);

  const toggleItemSelection = useCartStore((s) => s.toggleItemSelection);
  const toggleAllItems = useCartStore((s) => s.toggleAllItems);

  const fetchCart = useCartStore((s) => s.fetchCart);
  const status = useCartStore((s) => s.status);

  // *Kiểm tra xem checkbox tất cả có được chọn không
  const allSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  useEffect(() => {
    const fetchCartItems = async () => {
      if (status === 'idle' && userId) {
        await fetchCart(Number(userId));
      }
    };

    fetchCartItems();
  }, [userId, status, fetchCart]);

  // console.log('Cart items:', cartItems);

  if (status === 'loading' || status === 'idle') {
    return <div>loading...</div>;
  }

  if (status === 'error') {
    return <div>Đã có lỗi xảy ra khi tải giỏ hàng.</div>;
  }

  return (
    <>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className='lg:col-span-2 mb-24'>
          <div className='flex items-center gap-2 mb-2'>
            <Checkbox
              id='select-all'
              checked={allSelected}
              onCheckedChange={() => toggleAllItems(!allSelected)}
            />
            <Label
              htmlFor='select-all'
              className='text-primary text-base font-normal '
            >
              Tất cả sản phẩm
            </Label>

            <ClearCartButton userId={userId} />
          </div>

          <div className='space-y-4'>
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                cartItem={item}
                product={item.Product}
                selected={selectedItems.includes(Number(item.id))}
                onSelect={() => toggleItemSelection(Number(item.id))}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
