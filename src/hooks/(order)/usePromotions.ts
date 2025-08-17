import { fetchPromotionsbyUserAction } from '@/actions/userActions';
import { QUERY_KEY_PROMOTION } from '@/lib/constants';
import { usePromotionStore } from '@/stores/promotionStore';
import { TPromotion } from '@/types';
import { useQuery } from '@tanstack/react-query';

export default function usePromotions() {
  const { selectedPromotion, setSelectedPromotion } = usePromotionStore();

  // Lấy danh sách voucher khả dụng của user
  const { data: listPromotion = [], isLoading: loading } = useQuery<
    TPromotion[]
  >({
    queryKey: [QUERY_KEY_PROMOTION.LIST],
    queryFn: async () => {
      const response = await fetchPromotionsbyUserAction();
      return response.success ? response.data?.items || [] : [];
    },
  });

  // Xử lý khi người dùng chọn promotion mới
  const handleSelectPromotion = (id: string) => {
    const promotion = listPromotion.find((p) => p.id?.toString() === id);
    if (promotion) {
      setSelectedPromotion(promotion);
    } else {
      setSelectedPromotion(null);
    }
  };

  const calculateDiscount = (totalPrice: number) => {
    if (!selectedPromotion) return 0;

    const subtotal = totalPrice;

    // Tính giảm giá theo %
    if (selectedPromotion.discountPercent) {
      let discount = subtotal * (selectedPromotion.discountPercent / 100);

      return discount;
    }

    return 0;
  };

  return {
    selectedPromotion,
    handleSelectPromotion,
    calculateDiscount,
    loading,
    listPromotion,
  };
}
