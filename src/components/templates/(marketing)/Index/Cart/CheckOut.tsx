'use client';

import { Card, CardContent } from '@/components/ui/card';
import Total from './CheckOut/Total';
import CheckOutActions from './CheckOut/CheckOutActions';
import Fee from './CheckOut/Fee';
import { useCartStore } from '@/stores/cartStore';
import { useTranslations } from 'next-intl';
import useAddress from '@/hooks/(order)/useAddress';
import useProductVariant from '@/hooks/(order)/useProductVariant';
import useShippingFee from '@/hooks/useShippingFee';
import useCalculateTotal from '@/hooks/(order)/useCalculateTotal';

export function CheckOut() {
  const t = useTranslations('Header');

  const selectedTotalPrice = useCartStore((state) => state.selectedTotalPrice);
  const selectedItems = useCartStore((state) => state.selectedItems);
  const cartItems = useCartStore((state) => state.cartItems);

  const { currentAddress } = useAddress();
  const { productVariantList } = useProductVariant();

  const { shippingFee } = useShippingFee(currentAddress, productVariantList);

  // Nếu không có sản phẩm nào được chọn, tổng giá là 0

  const { total, calculatingShipping } = useCalculateTotal();
  const selectedCount = selectedItems.length;

  if (cartItems.length === 0) return null;

  return (
    <Card className='sticky top-4 rounded-xl border border-border adam-store-bg-light text-primary shadow '>
      <CardContent className='p-6 '>
        <h2 className='font-bold text-lg text-primary mb-4'>
          {t('cart.checkOut.title', { count: selectedCount })}
        </h2>

        <Fee
          subtotal={Number(selectedTotalPrice)}
          shippingFee={shippingFee}
          loading={calculatingShipping}
        />

        <Total total={total} />

        <CheckOutActions />
      </CardContent>
    </Card>
  );
}
