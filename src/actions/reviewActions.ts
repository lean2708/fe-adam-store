"use server";

import { checkProductReviewsApi, createProductReviewsApi, fetchProductReviewsApi, updateProductReviewsApi } from "@/lib/data/review";




export async function createProductReviewsAction(
    rating: number,
    comment: string,
    imageUrls: string[],
    productId: number,
) {
  try {
    const reviews = await createProductReviewsApi(rating, comment, imageUrls, productId)
    return {
      status: true,
      reviews,
    };
  } catch (error) {
    return {
      status: false,
      error,
    };
  }
}




export async function updateProductReviewsAction(    rating: number,
    comment: string,
    imageUrls: string[],
    productId: number,
) {
  try {
    const reviews = await updateProductReviewsApi(rating, comment, imageUrls, productId)

    if (!reviews) {
      return {
        status: true,
        message: 'Reviews not found',
      };
    }

    return {
      status: true,
      reviews,
    };
  } catch (error) {
    return {
      status: false,
      error,
    };
  }
}

export async function getProductReviewsAction(id: number) {
  try {
    const reviews = await fetchProductReviewsApi(id);

    if (!reviews) {
      return {
        status: true,
        message: 'Reviews not found',
      };
    }

    return {
      status: true,
      reviews,
    };
  } catch (error) {
    return {
      status: false,
      error,
    };
  }
}
export async function checkReviewAction(id: number) {
  try {
    const review = await checkProductReviewsApi(id);
    return {
      status: true,
      review,
    };
  } catch (error) {
    return {
      status: false,
      error,
    };
  }
}
