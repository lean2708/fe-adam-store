import { fetchPromotionsbyUserAction } from '@/actions/userActions';
import { QUERY_KEY_ADDRESS, QUERY_KEY_PROMOTION } from '@/lib/constants';
import { TPromotion } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function usePromotions() {
  const queryClient = useQueryClient();
  const [currentPromotion, setCurrentPromotion] = useState<TPromotion | null>(
    null
  );

  // Lấy danh sách voucher khả dụng của user
  const { data: listPromotion = [], isLoading: loading } = useQuery<
    TPromotion[]
  >({
    queryKey: [QUERY_KEY_PROMOTION.LIST],
    queryFn: async () => {
      const response = await fetchPromotionsbyUserAction();
      if (response.success) {
        const items = response.data?.items || [];
        // Auto chọn default address hoặc địa chỉ đầu tiên
        setCurrentPromotion(items[0]);
        return items;
      }
      setCurrentPromotion(null);
      return [];
    },
  });

  return {
    currentPromotion,
    setCurrentPromotion,
    loading,
    listPromotion,
  };
}
