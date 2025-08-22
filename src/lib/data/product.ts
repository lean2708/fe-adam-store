import { PageResponseReviewResponse } from './../../api-client/models/page-response-review-response';
import type { TProduct } from '@/types'; // your local template type

import {
  ProductControllerApi,
  type ProductRequest,
  type ProductUpdateRequest,
  ProductResponse,
  type PageResponseProductResponse,
} from '@/api-client';
import { ControllerFactory } from './factory-api-client';
import { getPublicAxiosInstance } from '@/lib/auth/axios-config';
import { transformProductResponseToTProduct } from './transform/product';

/**
 * Helper to get an instance of ProductControllerApi with NextAuth using factory.
 */
export async function getProductController() {
  return await ControllerFactory.getProductController();
}

/**
 * Helper to get a public instance of ProductControllerApi (no auth).
 */
export function getPublicProductController() {
  const axiosInstance = getPublicAxiosInstance();
  return new ProductControllerApi(undefined, undefined, axiosInstance);
}
/**
 * Create a new product (admin).
 */
export async function createProductApi(
  data: ProductRequest
): Promise<TProduct> {
  const api = await getProductController();
  const response = await api.create6({ productRequest: data });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return transformProductResponseToTProduct(
    response.data.result as ProductResponse
  );
}

/**
 * Update a product (admin).
 */
export async function updateProductApi(
  id: number,
  data: ProductUpdateRequest
): Promise<TProduct> {
  const api = await getProductController();
  const response = await api.update5({ id, productUpdateRequest: data });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return transformProductResponseToTProduct(
    response.data.result as ProductResponse
  );
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
  return transformProductResponseToTProduct(
    response.data.result as ProductResponse
  );
}

/**
 * Fetch all products for user (public).
 */
export async function fetchAllProductsApi(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<TProduct[]> {
  const api = await getProductController();
  const response = await api.fetchAll1({ page, size, sort });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return (response.data.result?.items ?? []).map(
    transformProductResponseToTProduct
  );
}

export async function fetchAllProductsTotalApi(
  page?: number,
  size?: number,
  sort?: string[]
) {
  const api = await getProductController();
  const response = await api.fetchAll1({ page, size, sort });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return {
    products: (response.data.result?.items ?? []).map(
      transformProductResponseToTProduct
    ),
    totalItem: response.data.result?.totalItems,
  };
}
/**
 * Fetch all products for admin (admin).
 */
export async function fetchAllProductsForAdminApi(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<TProduct[]> {
  const api = await getProductController();
  const response = await api.fetchAllProductsForAdmin({ page, size, sort });
  if (response.data.code !== 200) {
    throw response.data;
  }
  return (response.data.result?.items ?? []).map(
    transformProductResponseToTProduct
  );
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
  return transformProductResponseToTProduct(
    response.data.result as ProductResponse
  );
}

/**
 * Fetch all product's reviews  (public).
 */
export async function fetchProductReviewsApi(
  id: number,
  page?: number,
  size?: number,
  sort?: string[]
): Promise<PageResponseReviewResponse> {
  const api = await getProductController();
  const response = await api.fetchReviewsByProductId({
    productId: id,
    page,
    size,
    sort,
  });
  if (response.data.code !== 200) {
    throw response.data;
  }
  if (!response.data.result) {
    throw new Error('ProductResponse is missing in the response.');
  }
  return response.data.result as PageResponseReviewResponse;
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
  return (response.data.result?.items ?? []).map(
    transformProductResponseToTProduct
  );
}

/**
 * Fetch all products for admin with pagination (returns raw API response)
 */
export async function fetchAllProductsForAdmin(
  page: number = 0,
  size: number = 10,
  sort: string[] = ['id,desc']
): Promise<PageResponseProductResponse> {
  const controller = await ControllerFactory.getProductController();
  const response = await controller.fetchAllProductsForAdmin({
    page,
    size,
    sort,
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to fetch products');
  }

  return response.data.result!;
}

/**
 * Create a new product (returns raw API response)
 */
export async function createProduct(
  productData: ProductRequest
): Promise<ProductResponse> {
  const controller = await ControllerFactory.getProductController();
  const response = await controller.create6({
    productRequest: productData,
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to create product');
  }

  return response.data.result!;
}

/**
 * Update a product (returns raw API response)
 */
export async function updateProduct(
  id: number,
  productData: ProductUpdateRequest
): Promise<ProductResponse> {
  const controller = await ControllerFactory.getProductController();
  const response = await controller.update5({
    id,
    productUpdateRequest: productData,
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to update product');
  }

  return response.data.result!;
}

/**
 * Delete a product (soft delete)
 */
export async function deleteProduct(id: number): Promise<void> {
  const controller = await ControllerFactory.getProductController();
  const response = await controller.delete4({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to delete product');
  }
}

/**
 * Restore a product
 */
export async function restoreProduct(id: number): Promise<ProductResponse> {
  const controller = await ControllerFactory.getProductController();
  const response = await controller.restore2({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to restore product');
  }

  return response.data.result!;
}

/**
 * Fetch product by ID (returns raw API response)
 */
export async function fetchProductById(id: number): Promise<ProductResponse> {
  const controller = await ControllerFactory.getProductController();
  const response = await controller.fetchDetailById({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to fetch product');
  }

  return response.data.result!;
}
