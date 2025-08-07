// hooks/useCartItemActions.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  changeCartItemVariantAction,
  deleteCartItemAction,
} from '@/actions/cartActions';
import { toast } from 'sonner';
import { TCartItem, TProduct } from '@/types';
import { useAuth } from '../useAuth';

export const useCartItem = (
  cartItem: TCartItem,
  product: Omit<TProduct, 'Category'>,
  updateCartItem: (id: string, item: any) => void,
  removeCartItem: (id: string) => void
) => {
  const { user } = useAuth();

  // *Tìm màu và kích thước ban đầu
  const initialColor = useMemo(
    () =>
      product.colors?.find((c) => c.name === cartItem.color) ??
      product.colors?.[0],
    [cartItem.color, product.colors]
  );

  const initialSize = useMemo(
    () =>
      initialColor?.variants?.find((v) => v.size?.name === cartItem.size)?.size
        ?.name ?? initialColor?.variants?.[0]?.size?.name,
    [cartItem.size, initialColor]
  );

  // *State
  const [selectedColorId, setSelectedColorId] = useState<number | undefined>(
    initialColor?.id
  );
  const [selectedSizeName, setSelectedSizeName] = useState<string | undefined>(
    initialSize
  );
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const [isQuantityUpdating, setIsQuantityUpdating] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // *Tính toán giá trị dẫn xuất
  const currentColor = useMemo(
    () => product.colors?.find((c) => c.id === selectedColorId),
    [product.colors, selectedColorId]
  );

  const currentVariant = useMemo(
    () =>
      currentColor?.variants?.find((v) => v.size?.name === selectedSizeName),
    [currentColor, selectedSizeName]
  );

  const maxQuantity = useMemo(
    () => currentVariant?.quantity ?? 0,
    [currentVariant]
  );

  const [price, setPrice] = useState(currentVariant?.price);

  // TODO: Hiệu ứng để cập nhật giá khi variant thay đổi
  useEffect(() => {
    if (currentVariant?.price) {
      setPrice(currentVariant.price);
    } else {
      const initialVariant = initialColor?.variants?.find(
        (v) => v.size?.name === initialSize
      );
      setPrice(initialVariant?.price ?? 0);
    }
  }, [currentVariant, initialColor, initialSize]);

  const totalPrice = useMemo(() => {
    if (!price) return 0;
    return price * quantity;
  }, [price, quantity]);

  // TODO: Handler thay đổi màu sắc
  const onChangeColor = useCallback(
    async (colorId: number | undefined) => {
      if (!colorId) return;
      setIsChanged(true);

      try {
        const newColor = product.colors?.find((c) => c.id === colorId);
        if (!newColor) return;

        // *Tìm kích thước tương ứng hoặc kích thước đầu tiên
        const newSizeName = newColor.variants?.some(
          (v) => v.size?.name === selectedSizeName
        )
          ? selectedSizeName
          : newColor.variants?.[0]?.size?.name;

        const sizeId = newColor.variants?.find(
          (v) => v.size?.name === newSizeName
        )?.size?.id;

        if (!sizeId) throw new Error('Không tìm thấy kích thước phù hợp');

        const res = await changeCartItemVariantAction(
          user?.id || 0,
          cartItem.id,
          colorId,
          sizeId
        );

        if (res.success && res.cart) {
          updateCartItem(cartItem.id, res.cart);
          setSelectedColorId(colorId);
          setSelectedSizeName(newSizeName);

          // *Cập nhật giá từ variant mới
          const newVariant = newColor.variants?.find(
            (v) => v.size?.id === sizeId
          );
          if (newVariant?.price) {
            setPrice(newVariant.price);
          }

          toast.success('Đã cập nhật màu sản phẩm');
        } else {
          toast.error(res.message || 'Cập nhật thất bại');
        }
      } catch (error) {
        toast.error('Đã xảy ra lỗi khi cập nhật');
      } finally {
        setIsChanged(false);
      }
    },
    [cartItem.id, product.colors, selectedSizeName, updateCartItem]
  );

  // TODO: Handler thay đổi kích thước
  const onChangeSize = useCallback(
    async (sizeId: number | undefined) => {
      if (!sizeId || !selectedColorId) return;
      setIsChanged(true);

      try {
        const res = await changeCartItemVariantAction(
          user?.id || 0,
          cartItem.id,
          selectedColorId,
          sizeId
        );

        if (res.success && res.cart) {
          const newSizeName = currentColor?.variants?.find(
            (v) => v.size?.id === sizeId
          )?.size?.name;

          if (newSizeName) setSelectedSizeName(newSizeName);

          updateCartItem(cartItem.id, res.cart);

          // Cập nhật giá từ variant mới
          const newVariant = currentColor?.variants?.find(
            (v) => v.size?.id === sizeId
          );
          if (newVariant?.price) {
            setPrice(newVariant.price);
          }

          toast.success('Đã cập nhật kích thước sản phẩm');
        } else {
          toast.error(res.message || 'Cập nhật thất bại');
        }
      } catch (error) {
        toast.error('Đã xảy ra lỗi khi cập nhật');
      } finally {
        setIsChanged(false);
      }
    },
    [cartItem.id, currentColor, selectedColorId, updateCartItem]
  );

  // TODO: Handler thay đổi số lượng
  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      if (newQuantity < 1 || newQuantity > maxQuantity) return;
      if (!selectedColorId || !selectedSizeName) return;

      setIsQuantityUpdating(true);
      setQuantity(newQuantity);

      try {
        const sizeId = currentColor?.variants?.find(
          (v) => v.size?.name === selectedSizeName
        )?.size?.id;

        if (!sizeId) {
          toast.error('Không tìm thấy kích thước hiện tại');
          return;
        }

        const res = await changeCartItemVariantAction(
          user?.id || 0,
          cartItem.id,
          selectedColorId,
          sizeId,
          newQuantity
        );

        if (res.success && res.cart) {
          // setPrice(res.cart);
          updateCartItem(cartItem.id, res.cart);
        } else {
          toast.error(res.message || 'Cập nhật số lượng thất bại');
        }
      } catch (error) {
        toast.error('Đã xảy ra lỗi khi cập nhật số lượng');
      } finally {
        setIsQuantityUpdating(false);
      }
    },
    [
      cartItem.id,
      currentColor,
      maxQuantity,
      selectedColorId,
      selectedSizeName,
      updateCartItem,
    ]
  );

  const onRemoveItem = useCallback(async () => {
    try {
      const res = await deleteCartItemAction(cartItem.id, user?.id || 0);

      if (res.success) {
        removeCartItem(cartItem.id);
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } else {
        toast.error(res.message || 'Xóa sản phẩm thất bại');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa sản phẩm');
    }
  }, [cartItem.id, removeCartItem]);

  const increaseQuantity = useCallback(
    () => handleQuantityChange(quantity + 1),
    [handleQuantityChange, quantity]
  );

  const decreaseQuantity = useCallback(
    () => handleQuantityChange(quantity - 1),
    [handleQuantityChange, quantity]
  );

  return {
    selectedColorId,
    selectedSizeName,
    quantity,
    isQuantityUpdating,
    isChanged,
    maxQuantity,
    totalPrice,
    currentColor,
    currentVariant,
    onChangeColor,
    onChangeSize,
    onRemoveItem,
    increaseQuantity,
    decreaseQuantity,
  };
};
