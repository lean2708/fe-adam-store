// hooks/useCheckoutData.ts
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useBuyNowStore } from '@/stores/buyNowStore';
import useProductVariant from './useProductVariant';

export function useCheckoutDatas() {
  const searchParams = useSearchParams();
  const checkoutType = searchParams.get('type');

  const { productVariantList } = useProductVariant();
  const selectedTotalPrice = useCartStore((s) => s.selectedTotalPrice);
  const { buyNowItems } = useBuyNowStore();

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
      };
    }

    return {
      items: productVariantList,
      subtotal: selectedTotalPrice,
      type: 'cart' as const,
    };
  }, [checkoutType, buyNowItems, productVariantList, selectedTotalPrice]);

  return checkoutData;
}
