'use client';

import { useCartStore } from '@/stores/cartStore';
import { ProductItem } from './ProductItem';
import { useCartItem } from '@/hooks/(cart)/useCartItem';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function ProductList() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const fetchCart = useCartStore((s) => s.fetchCart);
  const status = useCartStore((s) => s.status);

  const cartItems = useCartStore((s) => s.cartItems);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (status === 'idle' && user?.id) {
        await fetchCart(Number(user?.id));
      }
    };

    fetchCartItems();
  }, [user?.id, status, fetchCart]);

  return (
    <div>
      <h3 className='text-2xl font-bold text-primary mb-6'>Sản phẩm</h3>
      <div className='space-y-6 overflow-y-auto h-screen'>
        {cartItems.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
