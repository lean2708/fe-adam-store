import { useState, useRef } from 'react';
import { TProduct, TVariant } from '@/types';
import { toast } from 'sonner';

export default function useProductDetails(product: TProduct) {
  const [selectVariant, setSelectVariant] = useState<TVariant | undefined>(
    product.colors?.[0]?.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  const selectedColor = useRef(product.colors?.[0]?.id);
  const selectedSize = useRef(product.colors?.[0]?.variants?.[0]?.size?.id);

  // TODO: Implement quantity change logic
  const onChangeColor = (color: number | undefined) => {
    selectedColor.current = color;
    const colorObj = product.colors?.find((c) => c.id === color);
    let variant = colorObj?.variants?.find(
      (v) => v.size?.id === selectedSize.current
    );

    if (!variant && colorObj?.variants?.length) {
      variant = colorObj.variants[0];
      selectedSize.current = variant.size?.id;
    }

    setSelectVariant(variant);
  };

  // TODO: Implement size change logic
  const onChangeSize = (size: number | undefined) => {
    selectedSize.current = size;
    setSelectVariant(
      product.colors
        ?.find((c) => c.id === selectedColor.current)
        ?.variants?.find((v) => v.size?.id === size)
    );
  };

  const increaseQuantity = () => {
    if (quantity >= (selectVariant?.quantity ?? 0)) {
      toast.error('Số lượng vượt quá số hàng có sẵn');
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  return {
    selectVariant,
    quantity,
    onChangeColor,
    onChangeSize,
    increaseQuantity,
    decreaseQuantity,
    selectedColor: selectedColor.current,
    selectedSize: selectedSize.current,
  };
}
