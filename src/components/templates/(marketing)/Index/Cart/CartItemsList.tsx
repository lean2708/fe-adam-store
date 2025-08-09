'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { CartItem } from './CartItem/CartItem';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import ClearCartButton from './CartItemsList/ClearItemsButton';
import { Label } from '@/components/ui/label';
import { CartItemSkeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

export function CartItemsList({ userId }: { userId: string }) {
  const t = useTranslations('Header');

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
    return (
      <div className='lg:col-span-2 mb-24 space-y-4'>
        {Array.from({ length: (cartItems?.length ?? 0) || 4 }).map((_, idx) => (
          <CartItemSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return <div>Đã có lỗi xảy ra khi tải giỏ hàng.</div>;
  }

  return (
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
          {t('cart.allProducts')}
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
  );
}
