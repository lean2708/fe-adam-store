'use client';

import { ProductItem } from './ProductItem';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useCheckoutDatas } from '@/hooks/(order)/useCheckOutDatas';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

export function ProductList() {
  const t = useTranslations('Order.product_list');

  const { isAuthenticated, isLoading, user } = useAuth();
  const selectedItems = useCartStore((s) => s.selectedItems);
  const router = useRouter();

  const { items: products } = useCheckoutDatas();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
    if (selectedItems.length === 0) {
      router.push('/');
      toast.info('Your order has been cancelled !', {
        description:
          'Please try the transaction again, avoid reloading the page',
      });
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div>
      <h3 className='text-2xl font-bold text-primary mb-6'>{t('title')}</h3>
      <div className='space-y-6 overflow-y-auto h-screen'>
        {products?.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
