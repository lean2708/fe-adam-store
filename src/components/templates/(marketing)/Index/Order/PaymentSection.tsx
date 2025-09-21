'use client';

import Promotions from './PaymentSection/Promotions';
import PaymentMethod from './PaymentSection/PaymentMethod';
import usePromotions from '@/hooks/(order)/usePromotions';
import usePaymentMethod from '@/hooks/(order)/usePaymentMethod';
import { useEffect } from 'react';
import { PAYMENT_METHODS } from '@/enums';
import { useOrderStore } from '@/stores/orderStore';
import { useTranslations } from 'next-intl';
import useIsMobile from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

export function PaymentSection() {
  const t = useTranslations('Order');
  const isMobile = useIsMobile();
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);

  const { listPromotion, selectedPromotion, handleSelectPromotion } =
    usePromotions();

  const {
    selectedMethod,
    getTranslatedAvailableMethods,
    handleSelectPaymentMethod,
  } = usePaymentMethod();

  // Handle payment method change with fee calculation
  const handlePaymentMethodChange = (method: PAYMENT_METHODS) => {
    handleSelectPaymentMethod(method);
    setPaymentMethod(method);
  };

  const paymentMethods = getTranslatedAvailableMethods(t);
  useEffect(() => {
    return () => {
      sessionStorage.removeItem(`payment-method-storage`);
    };
  }, []);

  return (
    <div className={cn(isMobile && 'border-border border p-4 rounded-md')}>
      <h2 className='text-2xl font-bold text-primary mb-4'>
        {t('payment_methods.header')}
      </h2>

      <Promotions
        promotionList={listPromotion}
        promotion={selectedPromotion}
        onPromotionChange={handleSelectPromotion}
      />

      <PaymentMethod
        selectedMethod={selectedMethod}
        onPaymentMethodChange={handlePaymentMethodChange}
        availableMethods={paymentMethods}
      />
    </div>
  );
}
