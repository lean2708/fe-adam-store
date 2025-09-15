'use client';

import { Separator } from '@/components/ui/separator';
import useAddress from '@/hooks/(order)/useAddress';
import useCalculateTotal from '@/hooks/(order)/useCalculateTotal';
import { useCheckoutDatas } from '@/hooks/(order)/useCheckOutDatas';
import usePromotions from '@/hooks/(order)/usePromotions';
import useShippingFee from '@/hooks/useShippingFee';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useLocale, useTranslations } from 'next-intl';

export function PaymentSummary() {
  const t = useTranslations('Order.payment_summary');
  const locale = useLocale();

  const { items: products, subtotal, type } = useCheckoutDatas();

  const { currentAddress } = useAddress();
  const selectedTotalPrice = useCartStore((s) => s.selectedTotalPrice);
  const { calculateDiscount } = usePromotions();

  const { shippingFee } = useShippingFee(currentAddress, products);

  const { total, isCalculatingTotal, calculatingShipping } =
    useCalculateTotal();

  const discount = calculateDiscount(
    type === 'buy-now' ? subtotal : selectedTotalPrice
  );

  return (
    <div className='space-y-3 text-sm'>
      <h4 className='text-2xl font-bold text-primary mb-4'>{t('title')}</h4>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>{t('sub_total')}</span>
        <span>
          {formatCurrency(
            type === 'buy-now' ? subtotal : selectedTotalPrice,
            locale
          )}
        </span>
      </div>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>{t('shipping_fee')}</span>
        <span>
          {calculatingShipping
            ? t('calcultating')
            : `${formatCurrency(shippingFee || 0, locale)}`}
        </span>
      </div>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>{t('promotion')}</span>
        <span>{formatCurrency(discount, locale)}</span>
      </div>
      <Separator className='mt-4' />
      <div className='text-primary font-bold  pt-3 flex justify-between'>
        <span className=''>{t('total')}</span>
        <span>
          {isCalculatingTotal
            ? t('calcultating')
            : formatCurrency(total, locale)}
        </span>
      </div>
    </div>
  );
}
