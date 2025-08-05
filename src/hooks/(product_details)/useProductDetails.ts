import { useState, useRef } from 'react';
import { TProduct, TVariant } from '@/types';
import { toast } from 'sonner';
import { fetchProductVariantByColorAndSize } from '@/actions/productVariantsActions';
import { addToCartAction } from '@/actions/cartActions';

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

  const handleAddToCart = async () => {
    const res = await addToCartAction({
      productVariantId: selectVariant?.id ?? 0,
      quantity: quantity,
    });

    console.log('Add to cart response:', res);

    if (res.status === 200) {
      return toast.success(`${res.message}`);
    }

    return toast.error(`${res.message}`);
  };

  const handleBuyNow = () => {
    // Logic mua ngay
  };

  return {
    selectVariant,
    quantity,
    onChangeColor,
    onChangeSize,
    increaseQuantity,
    decreaseQuantity,
    handleAddToCart,
    handleBuyNow,
    // Trả về các giá trị đã chọn
    selectedVariant: selectVariant,
    selectedQuantity: quantity,
    selectedColor: selectedColor.current,
    selectedSize: selectedSize.current,
  };
}
