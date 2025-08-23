import { useState, useRef, useTransition } from 'react';
import { TProduct, TProductVariant, TVariant } from '@/types';
import { toast } from 'sonner';
import { addToCartAction } from '@/actions/cartActions';
import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { getProductVariantByColorAndSizeAction } from '@/actions/productVariantActions';
import { useBuyNowStore } from '@/stores/buyNowStore';

export default function useProductDetails(product: TProduct) {
  const { user, isLogin } = useAuth();
  const router = useRouter();
  const setCartItems = useCartStore((state) => state.setCartItems);
  const cartItems = useCartStore((state) => state.cartItems);
  const setBuyNowItems = useBuyNowStore((state) => state.setBuyNowItems);
  const clearBuyNowItems = useBuyNowStore((state) => state.clearBuyNowItems);

  const [isPending, startTransition] = useTransition();

  const [selectVariant, setSelectVariant] = useState<TVariant | undefined>(
    undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Không chọn mặc định color và size
  const selectedColor = useRef<number | undefined>(undefined);
  const selectedSize = useRef<number | undefined>(undefined);

  // Khi chọn màu
  const onChangeColor = (color: number | undefined) => {
    selectedColor.current = color;

    if (!color) {
      setSelectVariant(undefined);
      return;
    }

    const colorObj = product.colors?.find((c) => c.id === color);

    // Nếu đã chọn size, tìm variant phù hợp
    let variant: TVariant | undefined = undefined;
    if (selectedSize.current) {
      variant = colorObj?.variants?.find(
        (v) => v.size?.id === selectedSize.current
      );
    }

    setSelectVariant(variant);
  };

  // Khi chọn size
  const onChangeSize = (size: number | undefined) => {
    selectedSize.current = size;

    if (!size) {
      setSelectVariant(undefined);
      return;
    }

    const colorObj = product.colors?.find(
      (c) => c.id === selectedColor.current
    );

    const variant = colorObj?.variants?.find((v) => v.size?.id === size);

    setSelectVariant(variant);
  };

  const increaseQuantity = () => {
    if (!selectVariant || !selectedColor.current || !selectedSize.current) {
      return toast.warning(
        'Vui lòng chọn đầy đủ màu sắc và kích thước của sản phẩm trước muốn thêm sản phẩm'
      );
    }
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
    if (!user || !isLogin) {
      router.push('/login');
      return toast.info('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục');
    }

    if (!selectVariant || !selectedColor.current || !selectedSize.current) {
      return toast.warning(
        'Vui lòng chọn đầy đủ màu sắc và kích thước của sản phẩm trước khi cho vào giỏ hàng'
      );
    }

    setIsAddingToCart(true);

    try {
      const res = await addToCartAction(
        {
          productVariantId: selectVariant?.id ?? 0,
          quantity: quantity,
        },
        user?.id || 0
      );

      if (res.status === 200) {
        // Add new item to existing cart items
        if (res.cartItem) {
          setCartItems([...cartItems, res.cartItem]);
        }
        return toast.success(`${res.message}`);
      }

      return toast.error(`${res.message}`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user || !isLogin) {
      router.push('/login');
      return toast.info('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục');
    }

    if (!selectVariant || !selectedColor.current || !selectedSize.current) {
      return toast.warning(
        'Vui lòng chọn đầy đủ màu sắc và kích thước của sản phẩm trước khi đặt hàng'
      );
    }

    setIsBuyingNow(true);

    try {
      // Get product variant details
      const variantDetails = await getProductVariantByColorAndSizeAction(
        product.id,
        selectedColor.current,
        selectedSize.current
      );

      if (variantDetails.success && variantDetails.product) {
        // Transform the response to match TProductVariant format
        const buyNowProduct: TProductVariant = {
          id: variantDetails.product.id,
          name: product.name,
          imageUrl: product.mainImage,
          price: variantDetails.product.price,
          quantity: quantity,
          color: variantDetails.product.color,
          size: variantDetails.product.size,
          isAvailable: variantDetails.product.isAvailable,
        };

        clearBuyNowItems();
        setBuyNowItems([buyNowProduct]);

        startTransition(() => {
          router.push('/order?type=buy-now');
        });
      } else {
        toast.error('Không thể lấy thông tin sản phẩm');
      }
    } finally {
      setIsBuyingNow(false);
    }
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
    // Loading states
    isPending,
    isAddingToCart,
    isBuyingNow,
    // Trả về các giá trị đã chọn
    selectedVariant: selectVariant,
    selectedQuantity: quantity,
    selectedColor: selectedColor.current,
    selectedSize: selectedSize.current,
  };
}
