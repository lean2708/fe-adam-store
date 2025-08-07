'use client';

import { Card, CardContent } from '@/components/ui/card';
import Total from './CheckOut/Total';
import CheckOutActions from './CheckOut/CheckOutActions';
import Fee from './CheckOut/Fee';
import { useCartStore } from '@/stores/cartStore';

export function CheckOut() {
  const cartItems = useCartStore((state) => state.cartItems);
  const selectedItems = useCartStore((state) => state.selectedItems);

  // Tính tổng giá các sản phẩm được chọn
  const selectedTotal = cartItems.reduce((total, item) => {
    if (selectedItems.includes(Number(item.id))) {
      // Tính giá dựa trên variant hiện tại
      const color = item.Product.colors?.find((c) => c.name === item.color);
      const variant = color?.variants?.find((v) => v.size?.name === item.size);
      return total + (variant?.price || 0) * item.quantity;
    }
    return total;
  }, 0);

  // Tính phí vận chuyển (miễn phí nếu tổng > 300,000 VND)
  const shippingFee =
    selectedTotal === 0 ? 0 : selectedTotal > 300000 ? 0 : 10000;
  const total = selectedTotal + shippingFee;
  const selectedCount = selectedItems.length;

  return (
    <Card className='sticky top-4 rounded-xl border border-border bg-background text-primary shadow '>
      <CardContent className='p-6 '>
        <h2 className='font-bold text-lg text-primary mb-4'>
          Tổng đơn hàng ({selectedCount} sản phẩm)
        </h2>

        <Fee subtotal={selectedTotal} shippingFee={shippingFee} />

        <Total total={total} />

        <CheckOutActions />
      </CardContent>
    </Card>
  );
}
