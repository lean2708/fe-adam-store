import { getProductVariantByColorAndSizeAction } from '@/actions/productVariantActions';
import { getProductDetailsAction } from '@/actions/productActions';
import { useCartStore } from '@/stores/cartStore';
import { TProductVariant } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { orderProductVariantKeys } from '@/lib/query_key';
import { useRef } from 'react';

export default function useProductVariant() {
  const orderSelectedItems = useCartStore((s) => s.orderSelectedItems);

  // Cache dữ liệu sản phẩm để tránh gọi API nhiều lần
  const productCache = useRef<Map<number, any>>(new Map());

  const { data: productVariantList, isLoading: loading } = useQuery({
    queryKey: [
      orderProductVariantKeys.all,
      orderProductVariantKeys.productVariants(orderSelectedItems),
    ],
    queryFn: async () => {
      if (!orderSelectedItems.length) return [];

      // Batch request cho các sản phẩm chưa có trong cache
      const uncachedProducts = orderSelectedItems.filter(
        (item) => !productCache.current.has(item.Product.id)
      );

      await Promise.all(
        uncachedProducts.map(async (item) => {
          try {
            const res = await getProductDetailsAction(
              item.Product.id.toString()
            );
            if (res?.product) {
              productCache.current.set(item.Product.id, res.product);
            }
          } catch (error) {
            console.error('Error fetching product', error);
          }
        })
      );

      // Xử lý song song các items
      return Promise.all(
        orderSelectedItems.map(async (item) => {
          try {
            const productDetail = productCache.current.get(item.Product.id);

            const variantRes = await getProductVariantByColorAndSizeAction(
              item.Product.id,
              item.color.id || 0,
              item.size.id || 0
            );

            if (variantRes?.product) {
              return {
                ...variantRes.product,
                name: productDetail?.name || item.Product.name,
                imageUrl: productDetail?.mainImage || '/placeholder.png',
                quantity: item.quantity,
                price: (variantRes.product.price || 0) * item.quantity,
              };
            }
          } catch (error) {
            console.error('Error processing item', error);
          }
          return null;
        })
      ).then((results) => results.filter(Boolean) as TProductVariant[]);
    },
    enabled: orderSelectedItems.length > 0,
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  return { loading, productVariantList };
}
