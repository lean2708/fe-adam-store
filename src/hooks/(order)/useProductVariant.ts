import { getProductVariantByColorAndSizeAction } from '@/actions/productVariantActions';
import { getProductDetailsAction } from '@/actions/productActions';
import { useCartStore } from '@/stores/cartStore';
import { TProductVariant } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { orderProductVariantKeys } from '@/lib/query_key';

export default function useProductVariant() {
  const orderSelectedItems = useCartStore((s) => s.orderSelectedItems);

  const { data: productVariantList, isLoading: loading } = useQuery<
    TProductVariant[]
  >({
    queryKey: [
      orderProductVariantKeys.all,
      orderProductVariantKeys.productVariants(orderSelectedItems),
    ],
    queryFn: async () => {
      if (!orderSelectedItems.length) return [];

      // Batch unique product IDs để giảm API calls
      const uniqueProductIds = [
        ...new Set(orderSelectedItems.map((item) => item.Product.id)),
      ];

      // Fetch product details một lần cho tất cả unique products
      const productDetailsMap = new Map();
      await Promise.all(
        uniqueProductIds.map(async (productId) => {
          try {
            const productDetailRes = await getProductDetailsAction(
              productId + ''
            );
            if (productDetailRes?.status === 200 && productDetailRes.product) {
              productDetailsMap.set(productId, productDetailRes.product);
            }
          } catch (error) {
            console.error('Error fetching product details:', productId, error);
          }
        })
      );

      // Sau đó fetch variants
      const results = await Promise.all(
        orderSelectedItems.map(async (item) => {
          try {
            const productDetail = productDetailsMap.get(item.Product.id);
            const productName =
              productDetail?.name || item.Product.name || 'Unknown';
            const productImg =
              productDetail?.mainImage ||
              item.Product.mainImage ||
              '/placeholder.png';

            const result = await getProductVariantByColorAndSizeAction(
              item.Product.id,
              item.color.id ?? 0,
              item.size.id ?? 0
            );

            if (!result.success || !result.product) return null;

            return {
              ...result.product,
              imageUrl: productImg,
              name: productName,
              quantity: item.quantity,
              price: (result.product.price ?? 0) * item.quantity,
            } as TProductVariant;
          } catch (error) {
            console.error('Error processing item:', item.id, error);
            return null;
          }
        })
      );

      return results.filter((item): item is TProductVariant => item !== null);
    },
    enabled: orderSelectedItems.length > 0,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  return { loading, productVariantList };
}
