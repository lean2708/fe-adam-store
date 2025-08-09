'use client';

import { Card, CardContent } from '@/components/ui/card';
import Total from './CheckOut/Total';
import CheckOutActions from './CheckOut/CheckOutActions';
import Fee from './CheckOut/Fee';
import { useCartStore } from '@/stores/cartStore';
import { useTranslations } from 'next-intl';

export function CheckOut() {
  const t = useTranslations('Header');

  const selectedTotalPrice = useCartStore((state) => state.selectedTotalPrice);
  const selectedItems = useCartStore((state) => state.selectedItems);

  // Nếu không có sản phẩm nào được chọn, tổng giá là 0
  const totalPrice = selectedItems.length > 0 ? selectedTotalPrice : 0;

  // Tính phí vận chuyển (miễn phí nếu tổng > 300,000 VND)
  const shippingFee = totalPrice === 0 ? 0 : totalPrice > 300000 ? 0 : 10000;

  const total = totalPrice + shippingFee;
  const selectedCount = selectedItems.length;

  return (
    <Card className='sticky top-4 rounded-xl border border-border bg-background text-primary shadow '>
      <CardContent className='p-6 '>
        <h2 className='font-bold text-lg text-primary mb-4'>
          {t('cart.checkOut.title', { count: selectedCount })}
        </h2>

        <Fee subtotal={Number(totalPrice)} shippingFee={shippingFee} />

        <Total total={total} />

        <CheckOutActions />
      </CardContent>
    </Card>
  );
}
