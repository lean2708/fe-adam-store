'use client';

import Promotions from './PaymentSection/Promotions';
import PaymentMethod from './PaymentSection/PaymentMethod';
import usePromotions from '@/hooks/(order)/usePromotions';
import usePaymentMethod from '@/hooks/(order)/usePaymentMethod';
import useAddress from '@/hooks/(order)/useAddress';
import useCalculateTotal from '@/hooks/(order)/useCalculateTotal';
import { useEffect, useRef } from 'react';
import { PAYMENT_METHODS } from '@/enums';

export function PaymentSection() {
  const { listPromotion, selectedPromotion, handleSelectPromotion } =
    usePromotions();

  const {
    selectedMethod,
    availableMethods,
    selectedMethodDetails,
    handleSelectPaymentMethod,
    calculatePaymentFee,
    validatePaymentMethod,
    updateAvailableMethodsForOrder,
  } = usePaymentMethod();

  const { currentAddress } = useAddress();
  const { total, isCalculatingTotal } = useCalculateTotal();

  const prevTotal = useRef(total);

  // Handle payment method change with fee calculation
  const handlePaymentMethodChange = (method: PAYMENT_METHODS) => {
    handleSelectPaymentMethod(method);

    // Calculate payment fee
    const fee = calculatePaymentFee(total);

    // Validate payment method
    const validation = validatePaymentMethod(total);

    console.log('Selected payment method:', {
      method,
      fee,
      validation,
      details: selectedMethodDetails,
    });
  };

  // Update available payment methods based on order conditions
  useEffect(() => {
    if (total > 0 && total !== prevTotal.current) {
      updateAvailableMethodsForOrder({
        total: total,
        shippingAddress: currentAddress!,
      });
      prevTotal.current = total;
    }
  }, [total, currentAddress, updateAvailableMethodsForOrder]);

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
