import { useCartStore } from '@/stores/cartStore';
import useStore from '@/stores/useStore';
import { TProductVariant } from '@/types';
import { useMemo } from 'react';
import { toast } from 'sonner';

export default function useProductVariant() {
  const cartItems = useStore(useCartStore, (s) => s.cartItems);
  const selectedItems = useStore(useCartStore, (s) => s.selectedItems);
  // const cartItems = useCartStore((s) => s.cartItems);
  // const selectedItems = useCartStore((s) => s.selectedItems);

  const clearProductVariantsStore = () => {
    useCartStore.persist.clearStorage();
  };

  const { productVariantList, loading } = useMemo(() => {
    // Handle hydration - if cartItems or selectedItems are null/undefined, return loading state
    if (!cartItems || !selectedItems?.length) {
      return { productVariantList: [], loading: false };
    }

    // Lọc cartItems dựa trên selectedItems
    const selectedItemsData = cartItems.filter((item) =>
      selectedItems.includes(Number(item.id))
    );

    // Add safety check
    if (!selectedItemsData.length) {
      return { productVariantList: [], loading: false };
    }

    // Xử lý từng item để tìm variant tương ứng
    const processedItems: TProductVariant[] = selectedItemsData!
      .map((item) => {
        try {
          // Tìm color tương ứng trong Product.colors
          const selectedColor = item.Product.colors?.find(
            (color) => color.id === item.color.id
          );

          if (!selectedColor) {
            toast.warning(
              `Color ${item.color.id} not found for product ${item.Product.id}`
            );
            return null;
          }

          // Tìm variant tương ứng với size trong color.variants
          const selectedVariant = selectedColor.variants?.find(
            (variant) => variant.size?.id === item.size.id
          );

          if (!selectedVariant) {
            toast.warning(
              `Variant not found for color ${item.color.id} and size ${item.size.id}`
            );
            return null;
          }

          // Trả về object với đầy đủ thông tin cần thiết
          return {
            label:"",
            id: selectedVariant.id,
            name: item.Product.name,
            // title: item.Product.title,
            imageUrl: item.Product.mainImage,
            price: selectedVariant.price,
            quantity: item.quantity,
            totalPrice: selectedVariant.price || 0 * item.quantity,
            color: {
              id: item.color.id,
              name: item.color.name,
            },
            size: {
              id: item.size.id,
              name: item.size.name,
            },
            isAvailable: selectedVariant.isAvailable,
          } as TProductVariant;
        } catch (error) {
          toast.error(`Error processing cart item:, ${error}, ${item}`);
          return null;
        }
      })
      .filter(Boolean) as TProductVariant[];

    return {
      productVariantList: processedItems,
      loading: false,
    };
  }, [cartItems, selectedItems]);

  return { loading, productVariantList, clearProductVariantsStore };
}
