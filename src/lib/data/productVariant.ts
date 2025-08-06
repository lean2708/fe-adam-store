import {
  ProductVariantControllerApi,
  ProductControllerApi,
  type ProductVariantResponse,
  type VariantCreateRequest,
  type VariantUpdateRequest,
  type PageResponseProductVariantResponse,
  type ApiResponsePageResponseProductVariantResponse
} from "@/api-client";
import { ControllerFactory } from "./factory-api-client";
import type { TProductVariant } from "@/types";
import type { ActionResponse } from "@/lib/types/actions";
import { extractErrorMessage } from "@/lib/utils";

/**
 * Helper to get an instance of ProductVariantControllerApi with NextAuth using factory.
 */
async function getProductVariantController() {
  return await ControllerFactory.getProductVariantController();
}

/**
 * Helper to get an instance of ProductControllerApi with NextAuth using factory.
 */
async function getProductController() {
  return await ControllerFactory.getProductController();
}

/**
 * Transform ProductVariantResponse to TProductVariant
 */
function transformProductVariantResponseToTProductVariant(response: ProductVariantResponse): TProductVariant {
  return {
    id: response.id || 0,
    price: response.price,
    quantity: response.quantity,
    isAvailable: response.isAvailable,
    status: response.status as 'ACTIVE' | 'INACTIVE',
    size: response.size,
    color: response.color,
    // Note: ProductVariantResponse doesn't include product info, so we'll need to handle this separately
  };
}

/**
 * Transform array of ProductVariantResponse to TProductVariant array
 */
function transformProductVariantArrayToTProductVariantArray(responses: ProductVariantResponse[]): TProductVariant[] {
  return responses.map(transformProductVariantResponseToTProductVariant);
}

/**
 * Fetch all product variants by product ID for admin
 */
export async function fetchAllProductVariantsByProductIdApi(
  productId: number,
  page: number = 0,
  size: number = 20,
  sort?: string[]
): Promise<ActionResponse<{ items: TProductVariant[]; totalPages: number; totalItems: number; page: number; size: number }>> {
  try {
    const api = await getProductController();
    const response = await api.getVariantsByProductIdForAdmin({
      productId,
      page,
      size,
      sort
    });

    if (response.data.code !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed to fetch product variants",
        code: response.data.code,
      };
    }

    const result = response.data.result;
    const variants = transformProductVariantArrayToTProductVariantArray(result?.items || []);

    return {
      success: true,
      data: {
        items: variants,
        totalPages: result?.totalPages || 0,
        totalItems: result?.totalItems || 0,
        page: result?.page || 0,
        size: result?.size || size
      },
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Failed to fetch product variants");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Create a new product variant
 */
export async function createProductVariantApi(variantData: {
  productId: number;
  colorId: number;
  sizeId: number;
  price: number;
  quantity: number;
}): Promise<ActionResponse<TProductVariant>> {
  try {
    const api = await getProductVariantController();
    const response = await api.createProductVariant({
      variantCreateRequest: {
        productId: variantData.productId,
        colorId: variantData.colorId,
        sizeId: variantData.sizeId,
        price: variantData.price,
        quantity: variantData.quantity,
      },
    });

    if (response.data.code !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed to create product variant",
        code: response.data.code,
      };
    }

    return {
      success: true,
      message: response.data.message,
      data: transformProductVariantResponseToTProductVariant(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Failed to create product variant");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Update an existing product variant
 */
export async function updateProductVariantApi(
  id: number,
  variantData: {
    price?: number;
    quantity?: number;
  }
): Promise<ActionResponse<TProductVariant>> {
  try {
    const api = await getProductVariantController();
    const response = await api.updatePriceAndQuantity({
      id,
      variantUpdateRequest: {
        price: variantData.price,
        quantity: variantData.quantity,
      },
    });

    if (response.data.code !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed to update product variant",
        code: response.data.code,
      };
    }

    return {
      success: true,
      message: response.data.message,
      data: transformProductVariantResponseToTProductVariant(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Failed to update product variant");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Delete a product variant (soft delete)
 */
export async function deleteProductVariantApi(id: number): Promise<ActionResponse<void>> {
  try {
    const api = await getProductVariantController();
    const response = await api.delete5({ id });

    if (response.data.code !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed to delete product variant",
        code: response.data.code,
      };
    }

    return {
      success: true,
      message: response.data.message,
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Failed to delete product variant");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Restore a product variant
 */
export async function restoreProductVariantApi(id: number): Promise<ActionResponse<TProductVariant>> {
  try {
    const api = await getProductVariantController();
    const response = await api.restore3({ id });

    if (response.data.code !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed to restore product variant",
        code: response.data.code,
      };
    }

    return {
      success: true,
      message: response.data.message,
      data: transformProductVariantResponseToTProductVariant(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Failed to restore product variant");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Find product variant by product, color, and size
 */
export async function findProductVariantByProductColorSizeApi(
  productId: number,
  colorId: number,
  sizeId: number
): Promise<ActionResponse<TProductVariant>> {
  try {
    const api = await getProductVariantController();
    const response = await api.findByProductAndColorAndSize({
      productId,
      colorId,
      sizeId
    });

    if (response.data.code !== 200) {
      return {
        success: false,
        message: response.data.message || "Product variant not found",
        code: response.data.code,
      };
    }

    return {
      success: true,
      message: response.data.message,
      data: transformProductVariantResponseToTProductVariant(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Failed to find product variant");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}
