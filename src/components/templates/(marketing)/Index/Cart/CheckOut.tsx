'use client';

import { Card, CardContent } from '@/components/ui/card';
import Total from './CheckOut/Total';
import CheckOutActions from './CheckOut/CheckOutActions';
import Fee from './CheckOut/Fee';
import { useCartStore } from '@/stores/cartStore';
import { useLocale, useTranslations } from 'next-intl';
import useAddress from '@/hooks/(order)/useAddress';
import useProductVariant from '@/hooks/(order)/useProductVariant';
import useShippingFee from '@/hooks/useShippingFee';
import useCalculateTotal from '@/hooks/(order)/useCalculateTotal';
import useIsMobile from '@/hooks/useIsMobile';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function CheckOut() {
  const t = useTranslations('Header');
  const isMobile = useIsMobile();
  const locale = useLocale();
  const router = useRouter();

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
    <Card className='fixed bottom-0 right-0 w-full  sm:sticky sm:top-4 rounded-xl border border-border adam-store-bg-light text-primary shadow '>
      <CardContent className='p-6 '>
        <h2 className='font-bold text-lg text-primary mb-4'>
          {t('cart.checkOut.title', { count: selectedCount })}
        </h2>

        <Fee
          subtotal={Number(selectedTotalPrice)}
          shippingFee={shippingFee}
          loading={calculatingShipping}
        />

        {isMobile ? (
          <>
            <Separator className='my-4' />
            <div className='flex items-center justify-between'>
              <span className='text-primary font-bold text-2xl'>
                {formatCurrency(total, locale)}
              </span>
              <Button
                onClick={() => router.push('/order')}
                className=' cursor-pointer py-5 px-10 font-medium'
                disabled={selectedItems.length === 0}
              >
                {t('cart.checkOut.action.order')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Separator className='mt-4' />
            <Total total={total} />
            <Separator className='mb-4' />

            <CheckOutActions />
          </>
        )}
      </CardContent>
    </Card>
  );
}
