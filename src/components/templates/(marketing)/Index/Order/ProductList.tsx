'use client';

import { ProductItem } from './ProductItem';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import useProductVariant from '@/hooks/(order)/useProductVariant';
import { useBuyNowStore } from '@/stores/buyNowStore';
import { TProductVariant } from '@/types';
import { useCheckoutDatas } from '@/hooks/(order)/useCheckOutDatas';

export function ProductList() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const { items: products } = useCheckoutDatas();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div>
      <h3 className='text-2xl font-bold text-primary mb-6'>Sản phẩm</h3>
      <div className='space-y-6 overflow-y-auto h-screen'>
        {products?.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
