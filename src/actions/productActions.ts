'use server';

import {
  updateProductApi,
  deleteProductApi,
  fetchAllProductsApi,
  searchProductApi,
  fetchProductReviewsApi,
  fetchProductDetailByIdApi,
  fetchAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  fetchProductById,
  fetchAllProductsTotalApi,
} from '@/lib/data/product';
import { productUpdateSchema } from '@/actions/schema/productSchema';
import type { ActionResponse } from '@/lib/types/actions';
import type {
  ProductResponse,
  ProductRequest,
  ProductUpdateRequest,
  PageResponseProductResponse,
} from '@/api-client/models';
// import { fetchProductReviewsApi } from '@/lib/data/review';

export async function getAllProductsAction(
  page?: number,
  size?: number,
  sort?: string[]
) {
  try {
    const products = await fetchAllProductsApi(page, size, sort);
    return {
      status: 200,
      products,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}
export async function getAllProductsTotalAction(
  page?: number,
  size?: number,
  sort?: string[]
) {
  try {
    const products = await fetchAllProductsTotalApi(page, size, sort);
    return {
      status: true,
      data: products,
    };
  } catch (error) {
    return {
      status: false,
      error,
    };
  }
}

export async function getProductDetailsAction(id: string) {
  try {
    const product = await fetchProductDetailByIdApi(Number(id));

    if (!product) {
      return {
        status: 404,
        message: 'Product not found',
      };
    }

    return {
      status: 200,
      product,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function getProductReviewsAction(
  id: string,
  page?: number,
  size?: number,
  sort?: string[]
) {
  try {
    const reviews = await fetchProductReviewsApi(Number(id), page, size, sort);

    if (!reviews) {
      return {
        status: 404,
        message: 'Product not found',
      };
    }

    return {
      status: 200,
      reviews,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const deleted = await deleteProductApi(Number(id));
    const allProducts = await fetchAllProductsApi();
    return {
      allProducts,
      status: 202,
      message: 'Product deleted',
      deleted,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function updateProductAction(formData: FormData) {
  // Parse details from formData
  const dataRaw = formData.get('data');
  if (!dataRaw) {
    return {
      status: 400,
      message: 'Missing product data',
    };
  }

  let details: any;
  try {
    details = JSON.parse(JSON.parse(JSON.stringify(dataRaw)));
  } catch {
    return {
      status: 400,
      message: 'Invalid product data format',
    };
  }

  // Validate using productUpdateSchema
  const validated = productUpdateSchema.safeParse(details);
  if (!validated.success) {
    return {
      status: 403,
      message: 'data invalid',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  if (!details.id) {
    return {
      status: 400,
      message: 'Missing product id',
    };
  }

  try {
    const updated = await updateProductApi(Number(details.id), validated.data);
    const allProducts = await fetchAllProductsApi();
    return {
      allProducts,
      status: 200,
      message: 'Product updated',
      updated,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function searchProductsAction(
  page?: number,
  size?: number,
  sort?: string[],
  search?: string[]
) {
  try {
    const products = await searchProductApi(page, size, sort, search);
    return {
      status: 200,
      products,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

// Admin Actions

/**
 * Fetch all products for admin
 */
export async function fetchAllProductsForAdminAction(
  page: number = 0,
  size: number = 10,
  sort: string[] = ['id,desc']
): Promise<ActionResponse<PageResponseProductResponse>> {
  try {
    const data = await fetchAllProductsForAdmin(page, size, sort);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch products',
    };
  }
}

/**
 * Create a new product (admin)
 */
export async function createProductAdminAction(
  productData: ProductRequest
): Promise<ActionResponse<ProductResponse>> {
  try {
    const data = await createProduct(productData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create product',
    };
  }
}

/**
 * Update a product (admin)
 */
export async function updateProductAdminAction(
  id: number,
  productData: ProductUpdateRequest
): Promise<ActionResponse<ProductResponse>> {
  try {
    const data = await updateProduct(id, productData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update product',
    };
  }
}

/**
 * Delete a product (soft delete) (admin)
 */
export async function deleteProductAdminAction(
  id: number
): Promise<ActionResponse<void>> {
  try {
    await deleteProduct(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to delete product',
    };
  }
}

/**
 * Restore a product
 */
export async function restoreProductAction(
  id: number
): Promise<ActionResponse<ProductResponse>> {
  try {
    const data = await restoreProduct(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to restore product',
    };
  }
}

/**
 * Fetch product by ID
 */
export async function fetchProductByIdAction(
  id: number
): Promise<ActionResponse<ProductResponse>> {
  try {
    const data = await fetchProductById(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch product',
    };
  }
}
