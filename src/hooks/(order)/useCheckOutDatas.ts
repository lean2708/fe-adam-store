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
  const selectedItems = useCartStore((s) => s.selectedItems);
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
        checlEmptyTemp: buyNowItems.length === 0,
      };
    }

    return {
      items: productVariantList,
      subtotal: selectedTotalPrice,
      type: 'cart' as const,
      checlEmptyTemp: selectedItems.length === 0,
    };
  }, [checkoutType, buyNowItems, productVariantList, selectedTotalPrice]);

  return checkoutData;
}
