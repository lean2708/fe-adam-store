import type { TProduct, TVariant, TEntityBasic, TColor } from "@/types"; // your local template type

import {
  ProductControllerApi,
  type ProductRequest,
  type ProductUpdateRequest,
  ProductResponse,
} from "@/api-client";
import { getNextAuthConfiguration, getPublicConfiguration, getAuthenticatedAxiosInstance } from "@/lib/nextauth-config";

/**
 * Helper to get an instance of ProductControllerApi with NextAuth config.
 */
export async function getProductController() {
  const config = await getNextAuthConfiguration();
  const axiosInstance = await getAuthenticatedAxiosInstance();
  return new ProductControllerApi(config, undefined, axiosInstance);
}

/**
 * Helper to get a public instance of ProductControllerApi (no auth).
 */
export function getPublicProductController() {
  const config = getPublicConfiguration();
  return new ProductControllerApi(config);
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

/**
 * Search products (public).
 * Search criteria format: field~value or field>value or field<value
 * Examples:
 * - name~shirt (contains "shirt")
 * - price>100000 (price greater than 100000)
 * - soldQuantity<50 (sold quantity less than 50)
 */
export async function searchProductApi(
  page?: number,
  size?: number,
  sort?: string[],
  search?: string[]
): Promise<TProduct[]> {
  const api = await getProductController();
  const response = await api.searchProduct({ page, size, sort, search });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return (response.data.result?.items ?? []).map(transformProductResponseToTProduct);
}



export function transformProductResponseToTProduct(apiProduct: ProductResponse): TProduct {
  // Group variants by color id
  const variants = apiProduct.variants ?? [];
  const groupedByColor: Record<string, TColor> = {};

  variants.forEach(v => {
    const colorId = v.color?.id ?? 0;
    const colorKey = colorId.toString();

    if (!groupedByColor[colorKey]) {
      groupedByColor[colorKey] = {
        id: colorId,
        name: v.color?.name ?? "",
        variants: [],
      };
    }

    const variant: TVariant = {
      id: v.id ?? 0,
      price: v.price ?? 0,
      quantity: v.quantity ?? 0,
      isAvailable: v.isAvailable ?? false,
      imageUrl: undefined, // ProductVariantResponse doesn't have image field
      status: v.status,
      size: v.size ? {
        id: v.size.id ?? 0,
        name: v.size.name ?? ""
      } : undefined,
    };

    groupedByColor[colorKey].variants!.push(variant);
  });

  // Get main image from product images array (first image if available)
  const mainImage = apiProduct.images && apiProduct.images.length > 0
    ? apiProduct.images[0]?.imageUrl ?? ""
    : "";

  return {
    title: apiProduct.name ?? "",
    mainImage: mainImage,
    id: apiProduct.id ?? 0,
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
