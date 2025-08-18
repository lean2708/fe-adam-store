import { PAYMENT_METHODS } from '@/enums';
import { usepaymentMethodsStore } from '@/stores/paymentMethodStore';
import { AddressItem, TPaymentMethodOption } from '@/types';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export default function usePaymentMethod() {
  const selectedMethod = usepaymentMethodsStore((s) => s.selectedMethod);
  const availableMethods = usepaymentMethodsStore((s) => s.availableMethods);
  const setSelectedMethod = usepaymentMethodsStore((s) => s.setSelectedMethod);
  const setAvailableMethods = usepaymentMethodsStore(
    (s) => s.setAvailableMethods
  );
  const resetPaymentMethod = usepaymentMethodsStore(
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

  // Calculate payment fees (if any)
  const calculatePaymentFee = useCallback(
    (orderTotal: number) => {
      const methodDetails = getSelectedMethodDetails();

      // Add payment method specific fees here
      switch (selectedMethod) {
        case PAYMENT_METHODS.CASH:
          return toast.info(
            `orderTotal by ${methodDetails?.label}: ${orderTotal}`
          );
        case PAYMENT_METHODS.VNPAY:
          return toast.info(
            `orderTotal by ${methodDetails?.label}: ${orderTotal}`
          );
        default:
          return 0; // No additional fee
      }
    },
    [selectedMethod, getSelectedMethodDetails]
  );

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

  // Update available methods based on business logic
  // ?Can scale more (Example: Disable certain methods for specific regions )
  const updateAvailableMethodsForOrder = useCallback(
    (orderData: { total: number; shippingAddress?: AddressItem }) => {
      // Tạo bản sao sâu của availableMethods
      const methods = JSON.parse(JSON.stringify(availableMethods));
      let hasChange = false;

      // Kiểm tra và cập nhật trạng thái COD
      const cashMethodIndex = methods.findIndex(
        (m: TPaymentMethodOption) => m.value === PAYMENT_METHODS.CASH
      );

      if (cashMethodIndex >= 0) {
        const shouldBeAvailable = orderData.total <= 20000000;
        if (methods[cashMethodIndex].isAvailable !== shouldBeAvailable) {
          methods[cashMethodIndex].isAvailable = shouldBeAvailable;
          hasChange = true;
        }
      }

      // Chỉ cập nhật nếu có thay đổi
      if (hasChange) {
        setAvailableMethods(methods);
      }
    },
    [availableMethods, setAvailableMethods] // Giữ nguyên dependencies
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
    updateAvailableMethodsForOrder,

    // Utilities
    isMethodAvailable,
    calculatePaymentFee,
    validatePaymentMethod,
  };
}
