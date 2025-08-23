'use server';

import {
  createProductVariantApi,
  updateProductVariantApi,
  deleteProductVariantApi,
  restoreProductVariantApi,
  fetchAllProductVariantsByProductIdApi,
  findProductVariantByProductColorSizeApi,
  getProductVariantApi,
} from '@/lib/data/productVariant';
import {
  productVariantSchema,
  productVariantUpdateSchema,
} from './schema/productVariantSchema';
import type { ActionResponse } from '@/lib/types/actions';
import { extractErrorMessage } from '@/lib/utils';
import type { TProductVariant } from '@/types';

/**
 * Create a new product variant
 */
export async function addProductVariantAction(
  formData: FormData
): Promise<ActionResponse<TProductVariant>> {
  const productId = parseInt(formData.get('productId') as string);
  const colorId = parseInt(formData.get('colorId') as string);
  const sizeId = parseInt(formData.get('sizeId') as string);
  const price = parseFloat(formData.get('price') as string);
  const quantity = parseInt(formData.get('quantity') as string);

  const validatedFields = productVariantSchema.safeParse({
    productId,
    colorId,
    sizeId,
    price,
    quantity,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await createProductVariantApi({
    productId,
    colorId,
    sizeId,
    price,
    quantity,
  });

  return result;
}

/**
 * Update an existing product variant
 */
export async function updateProductVariantAction(
  variantId: number,
  formData: FormData
): Promise<ActionResponse<TProductVariant>> {
  const price = formData.get('price')
    ? parseFloat(formData.get('price') as string)
    : undefined;
  const quantity = formData.get('quantity')
    ? parseInt(formData.get('quantity') as string)
    : undefined;

  const updateData: any = {};
  if (price !== undefined) updateData.price = price;
  if (quantity !== undefined) updateData.quantity = quantity;

  const validatedFields = productVariantUpdateSchema.safeParse(updateData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await updateProductVariantApi(variantId, updateData);
  return result;
}

/**
 * Delete a product variant (soft delete)
 */
export async function deleteProductVariantAction(
  variantId: number
): Promise<ActionResponse<void>> {
  try {
    const result = await deleteProductVariantApi(variantId);
    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'Failed to delete product variant'
    );
    return {
      success: false,
      message: extractedError.message,
    };
  }
}

/**
 * Restore a product variant
 */
export async function restoreProductVariantAction(
  variantId: number
): Promise<ActionResponse<TProductVariant>> {
  try {
    const result = await restoreProductVariantApi(variantId);
    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'Failed to restore product variant'
    );
    return {
      success: false,
      message: extractedError.message,
    };
  }
}

/**
 * Get all product variants by product ID for admin
 */
export async function getAllProductVariantsByProductIdAction(
  productId: number,
  page: number = 0,
  size: number = 20,
  sort?: string[]
): Promise<
  ActionResponse<{
    items: TProductVariant[];
    totalPages: number;
    totalItems: number;
    page: number;
    size: number;
  }>
> {
  try {
    const result = await fetchAllProductVariantsByProductIdApi(
      productId,
      page,
      size,
      sort
    );
    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'Failed to load product variants'
    );
    return {
      success: false,
      message: extractedError.message,
    };
  }
}

/**
 * Find product variant by product, color, and size
 */
export async function findProductVariantByProductColorSizeAction(
  productId: number,
  colorId: number,
  sizeId: number
): Promise<ActionResponse<TProductVariant>> {
  try {
    const result = await findProductVariantByProductColorSizeApi(
      productId,
      colorId,
      sizeId
    );
    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'Failed to find product variant'
    );
    return {
      success: false,
      message: extractedError.message,
    };
  }
}

export async function getProductVariantByColorAndSizeAction(
  productId: number,
  colorId: number,
  sizeId: number
) {
  try {
    const product = await getProductVariantApi(productId, colorId, sizeId);
    return {
      success: true,
      status: 200,
      message: 'Get product variant success',
      product,
    };
  } catch (error) {
    const extracted = extractErrorMessage(
      error,
      'Failed to get product variant.'
    );
    return { success: false, message: extracted.message, apiError: extracted };
  }
}
