import { useCartStore } from '@/stores/cartStore';
import useProductVariant from './useProductVariant';
import usePromotions from './usePromotions';
import useShippingFee from '../useShippingFee';
import useAddress from './useAddress';

export default function useCalculateTotal() {
  const { currentAddress } = useAddress();

  const { productVariantList } = useProductVariant();
  const selectedTotalPrice = useCartStore((s) => s.selectedTotalPrice);
  const { calculateDiscount } = usePromotions();

  const { shippingFee, calculatingShipping } = useShippingFee(
    currentAddress,
    productVariantList
  );

  const discount = calculateDiscount(selectedTotalPrice);

  const isCalculatingTotal = calculatingShipping;
  const total = selectedTotalPrice + (shippingFee || 0) - discount;

  return { total, isCalculatingTotal, calculatingShipping };
}
