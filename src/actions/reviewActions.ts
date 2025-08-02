"use server";

import { fetchProductReviewssApi } from '@/lib/data/product';

/**
 * Fetch all reviews items for a product.
 * ?fetchProductReviewssApi func thuộc về productControllerApi, reviewControllerApi không có hàm này.
 * ?Nên không khởi tạo data/reivew.ts.
 */
export async function getProductReviewsAction(
  id: string,
  page?: number,
  size?: number,
  sort?: string[]
) {
  try {
    const reviews = await fetchProductReviewssApi(Number(id), page, size, sort);

    if (!reviews) {
      return {
        status: 404,
        message: 'Reviews not found',
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
