import { formatCurrency } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

function Fee({
  subtotal,
  shippingFee,
  loading,
}: {
  subtotal: number;
  shippingFee: number;
  loading: boolean;
}) {
  const t = useTranslations('Header');
  const locale = useLocale();

  return (
    <div className='space-y-3 border-border border-b-2 pb-4'>
      <div className='flex justify-between text-sm text-primary'>
        <span className=''>{t('cart.checkOut.productFeeTotal')}</span>
        <span className='font-medium'>{formatCurrency(subtotal, locale)}</span>
      </div>
      <div className='flex justify-between text-sm text-primary'>
        <span className=''>{t('cart.checkOut.shippingFee')}</span>
        <span className='font-medium'>
          {loading
            ? 'Calculating...'
            : shippingFee === 0
            ? '0 VNĐ'
            : formatCurrency(shippingFee, locale)}
        </span>
      </div>
    </div>
  );
}

export default Fee;
