'use client';

import { useEffect, useState } from 'react';
import { CartItemsList } from '@/components/templates/(marketing)/Index/Cart/CartItemsList/CartItemsList';
import { CheckOut } from '@/components/templates/(marketing)/Index/Cart/CheckOut';
import { cn } from '@/lib/utils';
import { manrope } from '@/config/fonts';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  const initialCartItems = [
    {
      id: 'item1',
      name: 'Áo in cotton Care & Share',
      color: 'Nâu cà',
      image: '/placeholder.svg?height=100&width=100',
      price: 700000,
      originalPrice: 700000,
      quantity: 2,
      colorOptions: [{ value: 'trang', label: 'Trắng' }],
      sizeOptions: [{ value: 's', label: 'S' }],
      selectedColor: 'trang',
      selectedSize: 's',
    },
    {
      id: 'item2',
      name: 'Áo khoác gió chống nước UrbanShield',
      color: 'Nâu cà',
      image: '/placeholder.svg?height=100&width=100',
      price: 700000,
      originalPrice: 700000,
      quantity: 2,
      colorOptions: [{ value: 'xanh-navy', label: 'Xanh navy' }],
      sizeOptions: [{ value: 'm', label: 'M' }],
      selectedColor: 'xanh-navy',
      selectedSize: 'm',
    },
    {
      id: 'item3',
      name: 'Áo polo thể thao CoolTech',
      color: 'Nâu cà',
      image: '/placeholder.svg?height=100&width=100',
      price: 700000,
      originalPrice: 700000,
      quantity: 2,
      colorOptions: [{ value: 'xam-than', label: 'Xám than' }],
      sizeOptions: [{ value: 'l', label: 'L' }],
      selectedColor: 'xam-than',
      selectedSize: 'l',
    },
    {
      id: 'item4',
      name: 'Quần bò Slim Fit Classic',
      color: 'Nâu cà',
      image: '/placeholder.svg?height=100&width=100',
      price: 700000,
      originalPrice: 700000,
      quantity: 2,
      colorOptions: [{ value: 'trang', label: 'Trắng' }],
      sizeOptions: [{ value: 'l', label: 'L' }],
      selectedColor: 'trang',
      selectedSize: 'l',
    },
  ];
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className='min-h-screen bg-[#ffffff]'>
      <main className={cn(`max-w-7xl mx-auto px-4 py-8`, manrope.className)}>
        <h1 className='text-3xl md:text-4xl xl:text-5xl font-semibold text-primary text-center mb-8'>
          Giỏ hàng của bạn
        </h1>

        <div className='grid lg:grid-cols-3 gap-8'>
          <CartItemsList userId={user?.id + ''} />

          <div className='lg:col-span-1'>
            <CheckOut
              itemCount={totalItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
