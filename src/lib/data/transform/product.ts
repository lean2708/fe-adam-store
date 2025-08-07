import type { ProductResponse } from "@/api-client/models";
import { TProduct, TColor, TVariant } from "@/types";

export function transformProductResponseToTProduct(
  apiProduct: ProductResponse
): TProduct {
  const variants = apiProduct.variants ?? [];
  const groupedByColor: Record<string, TColor> = {};

  for (const v of variants) {
    const colorId = v.color?.id ?? 0;
    const colorKey = colorId.toString();
    if (!groupedByColor[colorKey]) {
      groupedByColor[colorKey] = {
        id: colorId,
        name: v.color?.name ?? "",
        variants: [],
      };
    }
    groupedByColor[colorKey].variants!.push({
      id: v.id ?? 0,
      price: v.price ?? 0,
      quantity: v.quantity ?? 0,
      isAvailable: v.isAvailable ?? false,
      imageUrl: undefined,
      status: v.status,
      size: v.size
        ? { id: v.size.id ?? 0, name: v.size.name ?? "" }
        : undefined,
    });
  }

  const mainImage =
    apiProduct.images && apiProduct.images.length > 0
      ? apiProduct.images[0]?.imageUrl ?? ""
      : "";

  // minPrice, maxPrice: get from variants, fallback 0
  let minPrice = 0,
    maxPrice = 0;
  if (variants.length > 0) {
    minPrice = Math.min(...variants.map((v) => v.price ?? 0));
    maxPrice = Math.max(...variants.map((v) => v.price ?? 0));
  }

  return {
    title: apiProduct.name ?? "",
    mainImage,
    images:
      apiProduct.images?.map((img) => ({
        imageUrl: img.imageUrl ?? "",
        id: img.id ?? 0,
      })) ?? [],
    id: apiProduct.id ?? 0,
    minPrice,
    maxPrice,
    isAvailable: apiProduct.isAvailable ?? false,
    name: apiProduct.name ?? "",
    description: apiProduct.description ?? "",
    averageRating: apiProduct.averageRating ?? 0,
    soldQuantity: apiProduct.soldQuantity ?? 0,
    totalReviews: apiProduct.totalReviews ?? 0,
    status: apiProduct.status ?? "INACTIVE",
    createdAt: apiProduct.createdAt ?? "",
    colors: Object.values(groupedByColor),
  };
}
