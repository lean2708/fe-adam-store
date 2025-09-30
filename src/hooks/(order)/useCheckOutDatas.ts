// hooks/useCheckoutData.ts
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useBuyNowStore } from '@/stores/buyNowStore';
import useProductVariant from './useProductVariant';

export function useCheckoutDatas() {
  const searchParams = useSearchParams();
  const checkoutType = searchParams.get('type');

  const { productVariantList, loading: variantLoading } = useProductVariant();
  const selectedTotalPrice = useCartStore((s) => s.selectedTotalPrice);
  // const selectedItems = useCartStore((s) => s.selectedItems);
  const { buyNowItems } = useBuyNowStore();
  const cartStatus = useCartStore((s) => s.status);

  const checkoutData = useMemo(() => {
    if (checkoutType === 'buy-now') {
      const buyNowTotal = buyNowItems.reduce(
        (sum, item) => sum + item.price! * item.quantity!,
        0
      );

      return {
        items: buyNowItems,
        subtotal: buyNowTotal,
        type: 'buy-now' as const,
        isEmpty: buyNowItems.length === 0,
        isLoading: false,
      };
    }

    return {
      items: productVariantList,
      subtotal: selectedTotalPrice,
      type: 'cart' as const,
      isEmpty: productVariantList.length === 0 && !variantLoading,
      isLoading: variantLoading || cartStatus === 'loading',
    };
  }, [
    checkoutType,
    buyNowItems,
    productVariantList,
    selectedTotalPrice,
    variantLoading,
    cartStatus,
  ]);

  return checkoutData;
}
