import { deleteAllCartItemsAction } from '@/actions/cartActions';
import { useCartStore } from '@/stores/cartStore';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useCart = (userId: string) => {
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.cartItems);

  const handleDeleteAllItems = useCallback(async () => {
    try {
      const res = await deleteAllCartItemsAction(userId);

      if (res.success) {
        clearCart();
        toast.success('Đã xóa toàn bộ giỏ hàng');
      } else {
        toast.error(res.message || 'Xóa giỏ hàng thất bại');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa giỏ hàng');
    }
  }, [clearCart]);

  return {
    cartItems,
    clearCart,
    handleDeleteAllItems,
  };
};
