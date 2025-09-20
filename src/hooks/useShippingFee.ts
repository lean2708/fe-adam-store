import { useQuery } from '@tanstack/react-query';
import { calculateShippingFeeAction } from '@/actions/orderActions';
import type { TProductVariant } from '@/types';
import type { TAddressItem } from '@/types';
import { QUERY_KEY_ORDER_FEE } from '@/lib/constants';
import { oderCalculationKeys } from '@/lib/query_key';

export default function useShippingFee(
  currentAddress: TAddressItem | null,
  orderItems: TProductVariant[] | undefined
) {
  const {
    data: shippingFee = 0,
    isLoading: calculatingShipping,
    error,
    isError,
  } = useQuery({
    queryKey: [
      QUERY_KEY_ORDER_FEE.SHIPPING_FEE,
      oderCalculationKeys.shippingFee(currentAddress?.id, orderItems),
    ],
    queryFn: async () => {
      // Không tính phí nếu không có địa chỉ hoặc sản phẩm
      if (!currentAddress?.id || !orderItems?.length) {
        return 0;
      }

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
        return result.data.total;
      } else {
        throw new Error(result.message || 'Failed to calculate shipping fee');
      }
    },
    enabled: Boolean(currentAddress?.id && orderItems?.length),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    shippingFee,
    calculatingShipping,
    error: isError ? (error as Error)?.message || 'An error occurred' : null,
  };
}
