import { useCartStore } from '@/stores/cartStore';
import useProductVariant from './useProductVariant';
import usePromotions from './usePromotions';
import useShippingFee from '../useShippingFee';
import useAddress from './useAddress';
import { useCheckoutDatas } from './useCheckOutDatas';
import { useMemo } from 'react';

export default function useCalculateTotal() {
  const { currentAddress } = useAddress();

  const { items: products, subtotal, type } = useCheckoutDatas();

  const selectedTotalPrice = useCartStore((s) => s.selectedTotalPrice);
  const { calculateDiscount } = usePromotions();

  const { shippingFee, calculatingShipping } = useShippingFee(
    currentAddress,
    products
  );

  const discount = calculateDiscount(
    type === 'buy-now' ? subtotal : selectedTotalPrice
  );

  const isCalculatingTotal = calculatingShipping;

  const total = useMemo(() => {
    if (type === 'buy-now') {
      return subtotal + (shippingFee || 0) - discount;
    }
    return selectedTotalPrice + (shippingFee || 0) - discount;
  }, [type, subtotal, calculateDiscount]);
  // const total = selectedTotalPrice + (shippingFee || 0) - discount;

  return { total, isCalculatingTotal, calculatingShipping };
}
