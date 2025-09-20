'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { CartItem } from './CartItem/CartItem';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import ClearCartButton from './CartItemsList/ClearItemsButton';
import { Label } from '@/components/ui/label';
import { CartItemSkeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import EmptyCart from './EmptyCart';

export function CartItemsList() {
  const t = useTranslations('Header');

  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const cartItems = useCartStore((s) => s.cartItems);
  const selectedItems = useCartStore((s) => s.selectedItems);

  const toggleItemSelection = useCartStore((s) => s.toggleItemSelection);
  const toggleAllItems = useCartStore((s) => s.toggleAllItems);

  const status = useCartStore((s) => s.status);

  // *Kiểm tra xem checkbox tất cả có được chọn không
  const allSelected =
    (cartItems?.length ?? 0) > 0 &&
    selectedItems.length === (cartItems?.length ?? 0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (status === 'loading') {
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
    <>
      {cartItems?.length === 0 && status === 'success' ? (
        <EmptyCart className=' order-2' />
      ) : (
        <div className='lg:col-span-2 sm:mb-24 mb-44'>
          <div className='flex items-center gap-2 mb-2'>
            <Checkbox
              id='select-all'
              checked={allSelected}
              onCheckedChange={() => toggleAllItems(!allSelected)}
              className='size-5 md:size-4'
            />
            <Label
              htmlFor='select-all'
              className='text-primary text-lg md:text-base font-normal '
            >
              {t('cart.allProducts')}
            </Label>

            <ClearCartButton userId={user?.id + ''} />
          </div>

          <div className='space-y-4'>
            {cartItems?.map((item) => (
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
