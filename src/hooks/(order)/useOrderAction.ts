import { createOrderAction } from '@/actions/orderActions';
import { PAYMENT_METHODS } from '@/enums';
import useAddress from '@/hooks/(order)/useAddress';
import usePaymentMethod from '@/hooks/(order)/usePaymentMethod';
import useProductVariant from '@/hooks/(order)/useProductVariant';
import usePromotions from '@/hooks/(order)/usePromotions';
import useShippingFee from '@/hooks/useShippingFee';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useOrderAction() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { productVariantList, clearProductVariantsStore } = useProductVariant();
  const { currentAddress } = useAddress();
  const { selectedMethod } = usePaymentMethod();
  const { selectedPromotion, clearSelectedPromotion } = usePromotions();
  const { shippingFee } = useShippingFee(currentAddress, productVariantList);

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

    if (productVariantList.length === 0) {
      toast.error('Giỏ hàng trống');
      return false;
    }

    return true;
  };

  // Prepare order data
  const prepareOrderData = () => {
    const baseOrderData = {
      addressId: currentAddress!.id!,
      orderItems: productVariantList.map((item) => ({
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
      // Clear promotion selection
      clearSelectedPromotion();

      // Clear product variants (selcet cart items)
      clearProductVariantsStore();
    } catch (error) {
      console.error('Error cleaning up order states:', error);
    }
  };

  // Mock VNPay payment processing
  const processVNPayPayment = async (orderData: any) => {
    // Mock VNPay API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate VNPay response
        const isSuccess = Math.random() > 0.1; // 90% success rate for demo

        if (isSuccess) {
          resolve({
            success: true,
            paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${
              orderData.total * 100
            }&vnp_Command=pay&vnp_CreateDate=${Date.now()}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:3000/payment/vnpay/return&vnp_TmnCode=DEMO&vnp_TxnRef=${Date.now()}&vnp_Version=2.1.0`,
            transactionId: `VNP_${Date.now()}`,
          });
        } else {
          reject(new Error('VNPay payment failed'));
        }
      }, 2000); // Simulate network delay
    });
  };

  // Handle cash payment
  const processCashPayment = async (orderData: any) => {
    try {
      const response = await createOrderAction(orderData);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      return response.data;
    } catch (error) {
      toast.error('Thanh toán CASH không thành công');
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
        await processCashPayment(orderData);

        cleanupOrderStates();

        toast.success('Đặt hàng thành công!');
        router.replace('/orders');
      } else if (selectedMethod === PAYMENT_METHODS.VNPAY) {
        // Handle VNPay payment
        toast.loading('Đang xử lý thanh toán VNPay...', {
          id: 'vnpay-processing',
        });

        // try {
        //   // First create the order
        //   const orderResponse = await createOrderAction(orderData);

        //   if (!orderResponse.success) {
        //     throw new Error(orderResponse.message || 'Tạo đơn hàng thất bại');
        //   }

        //   // Then process VNPay payment
        //   const vnpayResponse = await processVNPayPayment({
        //     ...orderData,
        //     orderId: orderResponse.data?.id,
        //     total: shippingFee + (selectedPromotion ? 0 : 0), // Calculate total properly
        //   });

        //   toast.dismiss('vnpay-processing');

        //   if (vnpayResponse.success) {
        //     toast.success('Chuyển hướng đến VNPay để thanh toán');
        //     // Redirect to VNPay payment page
        //     window.location.href = vnpayResponse.paymentUrl;
        //   }
        // } catch (vnpayError) {
        //   toast.dismiss('vnpay-processing');
        //   throw vnpayError;
        // }
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
  };
}
