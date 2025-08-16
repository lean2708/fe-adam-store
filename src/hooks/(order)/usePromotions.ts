import { fetchPromotionsbyUserAction } from '@/actions/userActions';
import { QUERY_KEY_PROMOTION } from '@/lib/constants';
import { TPromotion } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function usePromotions() {
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    null
  );

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

  // Đồng bộ selectedPromotion khi danh sách thay đổi
  // useEffect(() => {
  //   if (listPromotion.length > 0) {
  //     // Tìm promotion tương ứng với ID đã chọn
  //     const foundPromotion = selectedPromotionId
  //       ? listPromotion.find((p) => p.id?.toString() === selectedPromotionId)
  //       : null;

  //     // Cập nhật ID nếu chọn mặc định
  //     if (!foundPromotion && listPromotion[0]) {
  //       setSelectedPromotionId(listPromotion[0].id?.toString() || null);
  //     }
  //   } else {
  //     setSelectedPromotionId(null);
  //   }
  // }, [listPromotion, selectedPromotionId]);

  // Xử lý khi người dùng chọn promotion mới
  const handleSelectPromotion = (id: string) => {
    setSelectedPromotionId(id);
  };

  return {
    selectedPromotionId, // ID của promotion được chọn
    handleSelectPromotion,
    loading,
    listPromotion,
  };
}
