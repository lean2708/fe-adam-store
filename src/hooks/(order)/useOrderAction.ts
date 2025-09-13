import {
  createOrderAction,
  createOrderViaVNPayAction,
} from '@/actions/orderActions';
import { PAYMENT_METHODS } from '@/enums';
import useAddress from '@/hooks/(order)/useAddress';
import usePaymentMethod from '@/hooks/(order)/usePaymentMethod';
import useProductVariant from '@/hooks/(order)/useProductVariant';
import usePromotions from '@/hooks/(order)/usePromotions';
import useShippingFee from '@/hooks/useShippingFee';
import { useBuyNowStore } from '@/stores/buyNowStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCheckoutDatas } from './useCheckOutDatas';

export default function useOrderAction() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { clearProductVariantsStore } = useProductVariant();
  const { currentAddress } = useAddress();
  const { selectedMethod } = usePaymentMethod();
  const { items: products, type } = useCheckoutDatas();

  const { selectedPromotion, clearSelectedPromotion } = usePromotions();
  const { shippingFee } = useShippingFee(currentAddress, products);

  const clearBuyNowItems = useBuyNowStore((state) => state.clearBuyNowItems);

  // Check if current method is VNPay
  const isVNPayMethod = selectedMethod === PAYMENT_METHODS.VNPAY;

  // Validation logic
  const validateOrder = () => {
    if (!selectedMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return false;
    }

    if (!currentAddress) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return false;
    }

    if (products.length === 0) {
      toast.error('Giỏ hàng trống');
      return false;
    }

    return true;
  };

  // Prepare order data
  const prepareOrderData = () => {
    const baseOrderData = {
      addressId: currentAddress!.id!,
      orderItems: products.map((item) => ({
        productVariantId: item.id!,
        quantity: item.quantity!,
      })),
      shippingFee: shippingFee,
      paymentMethod: selectedMethod!,
    };

    if (selectedPromotion?.id) {
      return {
        ...baseOrderData,
        promotionId: selectedPromotion.id,
      };
    }

    return baseOrderData;
  };

  // Clean up all order-related states
  const cleanupOrderStates = () => {
    try {
      clearSelectedPromotion();

      if (type === 'cart') {
        clearProductVariantsStore();
      } else {
        clearBuyNowItems();
      }
    } catch (error) {
      console.error('Error cleaning up order states:', error);
    }
  };

  // VNPay payment processing
  const processVNPayPayment = async (orderData: any) => {
    try {
      const response = await createOrderViaVNPayAction(orderData);

      if (!response.success) {
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Thanh toán VNPAY không thành công: ', error);
      toast.error('Thanh toán VNPAY không thành công');
      return null;
    }
  };

  // Handle cash payment
  const processCashPayment = async (orderData: any) => {
    try {
      const response = await createOrderAction(orderData);

      if (!response.success) {
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Thanh toán CASH không thành công: ', error);
      toast.error('Thanh toán CASH không thành công');
      return null;
    }
  };

  // Main order placement function
  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = prepareOrderData();

      if (selectedMethod === PAYMENT_METHODS.CASH) {
        const result = await processCashPayment(orderData);

        if (result) {
          cleanupOrderStates();
          toast.success('Đặt hàng thành công!');
          router.replace('/orders');
        }
      } else if (selectedMethod === PAYMENT_METHODS.VNPAY) {
        const res = await processVNPayPayment(orderData);

        if (res?.paymentUrl) {
          cleanupOrderStates();
          toast.success(res.message);

          window.location.href = res.paymentUrl;
        } else {
          toast.dismiss('vnpay-processing');
          toast.error('Không thể tạo liên kết thanh toán VNPay');
        }
      } else {
        throw new Error('Phương thức thanh toán không được hỗ trợ');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Có lỗi xảy ra khi đặt hàng'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handlePlaceOrder,
    isProcessing,
    validateOrder,
    isVNPayMethod,
  };
}
