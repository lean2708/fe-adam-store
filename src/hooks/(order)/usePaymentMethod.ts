import { PAYMENT_METHODS } from '@/enums';
import { usepaymentMethodsStore } from '@/stores/paymentMethodStore';
import { useCallback } from 'react';
import { useStore } from 'zustand';

export default function usePaymentMethod() {
  const selectedMethod = useStore(
    usepaymentMethodsStore,
    (s) => s.selectedMethod
  );
  const availableMethods = useStore(
    usepaymentMethodsStore,
    (s) => s.availableMethods
  );
  const setSelectedMethod = useStore(
    usepaymentMethodsStore,
    (s) => s.setSelectedMethod
  );
  const setAvailableMethods = useStore(
    usepaymentMethodsStore,
    (s) => s.setAvailableMethods
  );
  const resetPaymentMethod = useStore(
    usepaymentMethodsStore,
    (s) => s.resetPaymentMethod
  );

  // Handle payment method selection
  const handleSelectPaymentMethod = useCallback(
    (method: PAYMENT_METHODS) => {
      setSelectedMethod(method);
    },
    [setSelectedMethod]
  );

  // Get payment method details
  const getSelectedMethodDetails = useCallback(() => {
    return availableMethods.find(
      (method) => method.value === selectedMethod.toString()
    );
  }, [availableMethods, selectedMethod]);

  // Check if a specific method is available
  const isMethodAvailable = useCallback(
    (method: PAYMENT_METHODS) => {
      return availableMethods.some((m) => m.value === method && m.isAvailable);
    },
    [availableMethods]
  );

  // Get available methods only
  const getAvailableMethods = useCallback(() => {
    return availableMethods.filter((method) => method.isAvailable);
  }, [availableMethods]);

  // Validate payment method for order
  const validatePaymentMethod = useCallback(
    (orderTotal: number) => {
      const methodDetails = getSelectedMethodDetails();

      if (!methodDetails || !methodDetails.isAvailable) {
        return {
          isValid: false,
          error: 'Phương thức thanh toán không khả dụng',
        };
      }

      // Add validation rules based on order total or other conditions
      if (selectedMethod === PAYMENT_METHODS.CASH && orderTotal > 20000000) {
        return {
          isValid: false,
          error: 'Thanh toán COD chỉ áp dụng cho đơn hàng dưới 20 triệu VND',
        };
      }

      return {
        isValid: true,
        error: null,
      };
    },
    [selectedMethod, getSelectedMethodDetails]
  );

  return {
    // State
    selectedMethod,
    availableMethods: getAvailableMethods(),
    allMethods: availableMethods,
    selectedMethodDetails: getSelectedMethodDetails(),

    // Actions
    handleSelectPaymentMethod,
    setAvailableMethods,
    resetPaymentMethod,

    // Utilities
    isMethodAvailable,
    validatePaymentMethod,
  };
}
