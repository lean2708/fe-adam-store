'use client';

import { ProductItem } from './ProductItem';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useCheckoutDatas } from '@/hooks/(order)/useCheckOutDatas';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export function ProductList({ className }: { className?: string }) {
  const t = useTranslations('Order.product_list');

  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const { items: products, isEmpty } = useCheckoutDatas();

  // Dùng ref để tránh push nhiều lần
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  // useEffect(() => {
  //   if (isEmpty && !hasRedirected.current) {
  //     hasRedirected.current = true;
  //     router.push('/');
  //     toast.info('Your order has been cancelled !', {
  //       description:
  //         'Please try the transaction again, avoid reloading the page',
  //     });
  //   }
  // }, [isEmpty, router]);

  return (
    <div className={className}>
      <h3 className='text-2xl font-bold text-primary mb-6'>{t('title')}</h3>
      <div className='space-y-6 overflow-y-auto md:h-screen h-full'>
        {products?.map((product, index) => (
          <div key={index}>
            <ProductItem key={index} product={product} />
            <Separator className='md:hidden block' />
          </div>
        ))}
      </div>
    </div>
  );
}
