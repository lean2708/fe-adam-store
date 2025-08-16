import { ControllerFactory } from './factory-api-client';
import { TProductVariant } from '@/types';

/**
 * Helper to get an instance of ProductControllerApi with NextAuth using factory.
 */
export async function getProductVariantController() {
  return await ControllerFactory.getProductVariantController();
}

/**
 * get a Product by color and size.
 */
export async function getProductVariantApi(
  productId: number,
  colorId: number,
  sizeId: number
): Promise<TProductVariant> {
  const api = await getProductVariantController();
  const response = await api.findByProductAndColorAndSize({
    productId,
    colorId,
    sizeId,
  });
  if (response.data.code !== 200) {
    throw response.data;
  }

  if (!response.data.result) {
    throw response.data;
  }

  return response.data.result;
}
