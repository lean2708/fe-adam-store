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
  updateCartItem?: (id: string, item: TCartItem) => void,
  removeCartItem?: (id: string) => void
) => {
  const { user } = useAuth();

  // *Tìm màu và kích thước dựa trên dữ liệu thực tế từ cartItem
  const findCurrentColorAndSize = useCallback(() => {
    // Tìm color dựa trên tên color trong cartItem
    const currentColor = product.colors?.find(
      (c) => c.name === cartItem.color.name
    );

    if (!currentColor) {
      // Fallback về color đầu tiên nếu không tìm thấy
      return {
        color: product.colors?.[0],
        size: product.colors?.[0]?.variants?.[0]?.size?.name,
      };
    }

    // Tìm size dựa trên tên size trong cartItem
    const currentVariant = currentColor.variants?.find(
      (v) => v.size?.name === cartItem.size.name
    );

    return {
      color: currentColor,
      size:
        currentVariant?.size?.name || currentColor.variants?.[0]?.size?.name,
    };
  }, [cartItem.color, cartItem.size, product.colors]);

  const { color: initialColor, size: initialSize } = useMemo(
    () => findCurrentColorAndSize(),
    [findCurrentColorAndSize]
  );

  // *State - khởi tạo dựa trên dữ liệu thực tế
  const [selectedColorId, setSelectedColorId] = useState<number | undefined>(
    initialColor?.id
  );
  const [selectedSizeName, setSelectedSizeName] = useState<string | undefined>(
    initialSize
  );
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const [isQuantityUpdating, setIsQuantityUpdating] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // // *Đồng bộ state khi cartItem thay đổi (sau khi reload hoặc update)
  // useEffect(() => {
  //   const { color, size } = findCurrentColorAndSize();
  //   setSelectedColorId(color?.id);
  //   setSelectedSizeName(size);
  //   setQuantity(cartItem.quantity);
  // }, [
  //   cartItem.color,
  //   cartItem.size,
  //   cartItem.quantity,
  //   findCurrentColorAndSize,
  // ]);

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

  // *Loại bỏ price state riêng, sử dụng trực tiếp từ currentVariant
  const price = useMemo(() => {
    return currentVariant?.price ?? 0;
  }, [currentVariant]);

  const totalPrice = useMemo(() => {
    return price * quantity;
  }, [price, quantity]);

  // TODO: Handler thay đổi màu sắc
  const onChangeColor = useCallback(
    async (colorId: number | undefined) => {
      if (!colorId || !user?.id) return;
      setIsChanged(true);

      try {
        const newColor = product.colors?.find((c) => c.id === colorId);
        if (!newColor) return;

        // *Tìm kích thước tương ứng hoặc kích thước đầu tiên
        const availableSizes = newColor.variants || [];
        const newSizeName = availableSizes.some(
          (v) => v.size?.name === selectedSizeName
        )
          ? selectedSizeName
          : availableSizes[0]?.size?.name;

        const sizeId = availableSizes.find((v) => v.size?.name === newSizeName)
          ?.size?.id;

        if (!sizeId) throw new Error('Không tìm thấy kích thước phù hợp');

        const res = await changeCartItemVariantAction(
          user.id,
          cartItem.id,
          colorId,
          sizeId
        );

        if (res.success && res.cart) {
          updateCartItem?.(cartItem.id, res.cart);
          setSelectedColorId(colorId);
          setSelectedSizeName(newSizeName);
          toast.success('Đã cập nhật màu sản phẩm');
        } else {
          toast.error(res.message || 'Cập nhật thất bại');
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi khi cập nhật: ', error);
        toast.error('Đã xảy ra lỗi khi cập nhật');
      } finally {
        setIsChanged(false);
      }
    },
    [cartItem.id, product.colors, selectedSizeName, updateCartItem, user?.id]
  );

  // TODO: Handler thay đổi kích thước
  const onChangeSize = useCallback(
    async (sizeId: number | undefined) => {
      if (!sizeId || !selectedColorId || !user?.id) return;
      setIsChanged(true);

      try {
        const res = await changeCartItemVariantAction(
          user.id,
          cartItem.id,
          selectedColorId,
          sizeId
        );

        if (res.success && res.cart) {
          const newSizeName = currentColor?.variants?.find(
            (v) => v.size?.id === sizeId
          )?.size?.name;

          if (newSizeName) setSelectedSizeName(newSizeName);

          updateCartItem?.(cartItem.id, res.cart);
          toast.success('Đã cập nhật kích thước sản phẩm');
        } else {
          toast.error(res.message || 'Cập nhật thất bại');
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi khi cập nhật: ', error);
        toast.error('Đã xảy ra lỗi khi cập nhật');
      } finally {
        setIsChanged(false);
      }
    },
    [cartItem.id, currentColor, selectedColorId, updateCartItem, user?.id]
  );

  // TODO: Handler thay đổi số lượng
  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      if (newQuantity < 1 || newQuantity > maxQuantity) return;
      if (!selectedColorId || !selectedSizeName || !user?.id) return;

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
          user.id,
          cartItem.id,
          selectedColorId,
          sizeId,
          newQuantity
        );

        if (res.success && res.cart) {
          updateCartItem?.(cartItem.id, res.cart);
        } else {
          toast.error(res.message || 'Cập nhật số lượng thất bại');
          // Revert quantity nếu thất bại
          setQuantity(cartItem.quantity);
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi khi cập nhật: ', error);
        toast.error('Đã xảy ra lỗi khi cập nhật số lượng');
        // Revert quantity nếu có lỗi
        setQuantity(cartItem.quantity);
      } finally {
        setIsQuantityUpdating(false);
      }
    },
    [
      cartItem.id,
      cartItem.quantity,
      currentColor,
      maxQuantity,
      selectedColorId,
      selectedSizeName,
      updateCartItem,
      user?.id,
    ]
  );

  const onRemoveItem = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsChanged(true);
      const res = await deleteCartItemAction(cartItem.id, user.id);

      if (res.success) {
        removeCartItem?.(cartItem.id);
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } else {
        toast.error(res.message || 'Xóa sản phẩm thất bại');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi khi xóa sản phẩm: ', error);
      toast.error('Đã xảy ra lỗi khi xóa sản phẩm');
    } finally {
      setIsChanged(false);
    }
  }, [cartItem.id, removeCartItem, user?.id]);

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
    price,
    currentColor,
    currentVariant,
    onChangeColor,
    onChangeSize,
    onRemoveItem,
    increaseQuantity,
    decreaseQuantity,
  };
};
