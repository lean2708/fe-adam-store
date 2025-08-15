'use server';

import { getProductVariantApi } from '@/lib/data/productVariant';
import { extractErrorMessage } from '@/lib/utils';

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
