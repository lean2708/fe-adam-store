import type { TProduct, TVariant, TEntityBasic, TColor } from "@/types"; // your local template type

import {
  ProductControllerApi,
  type ProductRequest,
  type ProductUpdateRequest,
  ProductResponse,
} from "@/api-client";
import { getAuthConfiguration } from "@/api-client/init-auth-config";

/**
 * Helper to get an instance of ProductControllerApi with auth config.
 */
export async function getProductController() { // This function is async
  const authConfig = await getAuthConfiguration(); // Await the config
  return new ProductControllerApi(authConfig); // Returns a Promise<ProductControllerApi>
}
/**
 * Create a new product (admin).
 */
export async function createProductApi(data: ProductRequest): Promise<TProduct> {
  const api = await getProductController();
  const response = await api.create6({ productRequest: data });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return transformProductResponseToTProduct(response.data.result as ProductResponse);
}

/**
 * Update a product (admin).
 */
export async function updateProductApi(id: number, data: ProductUpdateRequest): Promise<TProduct> {
  const api = await getProductController();
  const response = await api.update5({ id, productUpdateRequest: data });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return transformProductResponseToTProduct(response.data.result as ProductResponse);
}

/**
 * Soft delete a product (admin).
 */
export async function deleteProductApi(id: number): Promise<TProduct> {
  const api = await getProductController();
  const response = await api.delete4({ id });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return transformProductResponseToTProduct(response.data.result as ProductResponse);
}

/**
 * Fetch all products for user (public).
 */
export async function fetchAllProductsApi(page?: number, size?: number, sort?: string[]): Promise<TProduct[]> {
  const api = await getProductController();
  const response = await api.fetchAll1({ page, size, sort });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return (response.data.result?.items ?? []).map(transformProductResponseToTProduct);
}

/**
 * Fetch all products for admin (admin).
 */
export async function fetchAllProductsForAdminApi(page?: number, size?: number, sort?: string[]): Promise<TProduct[]> {
  const api = await getProductController();
  const response = await api.fetchAllProductsForAdmin({ page, size, sort });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return (response.data.result?.items ?? []).map(transformProductResponseToTProduct);
}

/**
 * Fetch product detail by id (public).
 */
export async function fetchProductDetailByIdApi(id: number): Promise<TProduct> {
  const api = await getProductController();
  const response = await api.fetchDetailById({ id });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return transformProductResponseToTProduct(response.data.result as ProductResponse);
}

export function transformProductResponseToTProduct(apiProduct: ProductResponse): TProduct {
  // Group variants by color id
  const variants = apiProduct.variants ?? [];
  const groupedByColor: Record<string, TColor> = {};

  variants.forEach(v => {
    const colorId = v.color?.id ?? 0;
    if (!groupedByColor[colorId]) {
      groupedByColor[colorId] = {
        id: colorId,
        name: v.color?.name ?? "",
        variants: [],
      };
    }
    const variant: TVariant = {
      id: v.id,
      price: v.price,
      quantity: v.quantity,
      isAvailable: v.isAvailable,
      imageUrl: v.image?.imageUrl,
      status: v.status,
      size: v.size ? { id: v.size.id, name: v.size.name } : undefined,
    };
    groupedByColor[colorId].variants!.push(variant);
  });

  return {
    title: apiProduct.name ?? "",
    mainImage: apiProduct.variants?.[0]?.image?.imageUrl ?? "",
    id: apiProduct.id ?? 0,
    isAvailable: apiProduct.isAvailable,
    name: apiProduct.name,
    description: apiProduct.description,
    averageRating: apiProduct.averageRating,
    soldQuantity: apiProduct.soldQuantity,
    totalReviews: apiProduct.totalReviews,
    status: apiProduct.status,
    createdAt: apiProduct.createdAt,
    colors: Object.values(groupedByColor),
  };
}
