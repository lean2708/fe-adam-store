// hooks/useShippingFee.ts
import { useState, useEffect } from 'react';
import { calculateShippingFeeAction } from '@/actions/orderActions';
import type { TCartItem, TProductVariant } from '@/types';
import type { AddressItem } from '@/types';

export default function useShippingFee(
  currentAddress: AddressItem | null,
  orderItems: TCartItem[]
) {
  const [shippingFee, setShippingFee] = useState<number | undefined>(0);
  const [calculatingShipping, setCalculatingShipping] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      // Không tính phí nếu không có địa chỉ hoặc sản phẩm
      if (!currentAddress?.id || !orderItems.length) {
        isMounted && setShippingFee(0);
        return;
      }

      try {
        isMounted && setCalculatingShipping(true);
        setError(null);

        // Chuẩn bị dữ liệu gửi đi
        const shippingRequest = {
          addressId: currentAddress.id,
          orderItems: orderItems.map((item) => ({
            productVariantId: Number(item.id) || 0,
            quantity: item.quantity || 0,
          })),
        };

        // Gọi API tính phí
        const result = await calculateShippingFeeAction(shippingRequest);
        if (result.success && result.data) {
          isMounted && setShippingFee(result.data.total);
        } else {
          isMounted &&
            setError(result.message || 'Failed to calculate shipping fee');
        }
      } catch (err) {
        isMounted && setError('An error occurred');
        isMounted && setShippingFee(0);
      } finally {
        isMounted && setCalculatingShipping(false);
      }
    }, 500); // Debounce 500ms

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentAddress, orderItems]);

  return { shippingFee, calculatingShipping, error };
}
