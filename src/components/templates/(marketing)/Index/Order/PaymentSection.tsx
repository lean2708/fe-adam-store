'use client';

import Promotions from './PaymentSection/Promotions';
import PaymentMethod from './PaymentSection/PaymentMethod';
import usePromotions from '@/hooks/(order)/usePromotions';
import usePaymentMethod from '@/hooks/(order)/usePaymentMethod';
import useAddress from '@/hooks/(order)/useAddress';
import useCalculateTotal from '@/hooks/(order)/useCalculateTotal';
import { useEffect, useRef } from 'react';
import { PAYMENT_METHODS } from '@/enums';
import { useOrderStore } from '@/stores/orderStore';

export function PaymentSection() {
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);

  const { listPromotion, selectedPromotion, handleSelectPromotion } =
    usePromotions();

  const { selectedMethod, availableMethods, handleSelectPaymentMethod } =
    usePaymentMethod();

  // Handle payment method change with fee calculation
  const handlePaymentMethodChange = (method: PAYMENT_METHODS) => {
    handleSelectPaymentMethod(method);
    setPaymentMethod(method);
  };

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(`payment-method-storage`);
    };
  }, []);

  return (
    <div>
      <h2 className='text-2xl font-bold text-primary mb-4'>Thanh toán</h2>

      <Promotions
        promotionList={listPromotion}
        promotion={selectedPromotion}
        onPromotionChange={handleSelectPromotion}
      />

      <PaymentMethod
        selectedMethod={selectedMethod}
        onPaymentMethodChange={handlePaymentMethodChange}
        availableMethods={availableMethods}
      />
    </div>
  );
}
