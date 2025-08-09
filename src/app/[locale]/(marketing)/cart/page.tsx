'use client';

import { useEffect } from 'react';
import { CartItemsList } from '@/components/templates/(marketing)/Index/Cart/CartItemsList';
import { CheckOut } from '@/components/templates/(marketing)/Index/Cart/CheckOut';
import { cn } from '@/lib/utils';
import { manrope } from '@/config/fonts';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import EmptyCart from '@/components/templates/(marketing)/Index/Cart/EmptyCart';
import { useTranslations } from 'next-intl';

export default function CartPage() {
  const t = useTranslations('Header');

  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const cartItems = useCartStore((s) => s.cartItems);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className='min-h-screen bg-background'>
          <main
            className={cn(`max-w-7xl mx-auto px-4 py-8`, manrope.className)}
          >
            <h1 className='text-3xl md:text-4xl xl:text-5xl font-semibold text-primary text-center mb-8'>
              {t('cart.title')}
            </h1>

            <div className='grid lg:grid-cols-3 gap-8'>
              <CartItemsList userId={user?.id + ''} />

              <div className='lg:col-span-1'>
                <CheckOut />
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
