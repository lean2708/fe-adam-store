'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/stores/cartStore';

export default function CartInitializer() {
  const { user, isLogin } = useAuth();
  const { fetchCart, status } = useCartStore();

  useEffect(() => {
    if (isLogin && user?.id && status === 'idle') {
      fetchCart(user.id);
    }
  }, [isLogin, user, status, fetchCart]);

  return null;
}
