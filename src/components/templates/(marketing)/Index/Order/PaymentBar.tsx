'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useCalculateTotal from '@/hooks/(order)/useCalculateTotal';
import useOrderAction from '@/hooks/(order)/useOrderAction';
import usePaymentMethod from '@/hooks/(order)/usePaymentMethod';
import usePromotions from '@/hooks/(order)/usePromotions';
import { formatCurrency } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

export function PaymentBar() {
  const t = useTranslations('Order');
  const locale = useLocale();

  const { getTranslatedSelectedMethodDetails } = usePaymentMethod();
  const { total, isCalculatingTotal } = useCalculateTotal();
  const { selectedPromotion } = usePromotions();

  const { handlePlaceOrder, isProcessing } = useOrderAction();

  const translateMethodPayment = getTranslatedSelectedMethodDetails(t);
  return (
    <div className='fixed bottom-0 left-0 right-0 border-t-2 border-border adam-store-bg'>
      <div className='max-w-screen flex items-center justify-between h-[10vh]'>
        <div className='flex items-center justify-center px-4 h-full w-1/4'>
          {translateMethodPayment?.image && (
            <Image
              src={translateMethodPayment.image}
              alt={translateMethodPayment.label || 'Payment method'}
              className='object-contain h-6'
              width={32}
              height={32}
            />
          )}
          <p className='text-lg font-bold text-primary'>
            {translateMethodPayment?.label}
          </p>
        </div>

        <Separator orientation='vertical' className='' />
        <div className='flex items-center justify-center px-4 h-full w-1/4'>
          <p className='text-lg font-bold text-primary text-center'>
            {selectedPromotion?.discountPercent
              ? selectedPromotion?.discountPercent + '%'
              : t('payment_display.selected_discount')}
          </p>
        </div>

        <Separator orientation='vertical' className='' />

        <div className='flex items-center justify-center px-4 h-full w-1/4'>
          <p className='text-xl font-bold text-primary'>
            {isCalculatingTotal
              ? t('payment_display.calcultating')
              : formatCurrency(total, locale)}
          </p>
        </div>

        <Separator orientation='vertical' className='' />

        <Button
          variant={'default'}
          onClick={handlePlaceOrder}
          className='text-xl h-full rounded-none  w-1/4 px-4'
          disabled={isProcessing || isCalculatingTotal}
        >
          {t('action')}
        </Button>
      </div>
    </div>
  );
}
