"use server";

import { createProductReviewsApi, updateProductReviewsApi } from "@/lib/data/review";




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




export async function updateProductReviewsAction(id: number,req:{
    rating: number,
    comment: string,
    imageUrls: string[],
    productId: number,
}
) {
  try {
    const reviews = await updateProductReviewsApi(id, req);

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
    // const reviews = await fetchProductReviewsApi(id);

    // if (!reviews) {
    //   return {
    //     status: true,
    //     message: 'Reviews not found',
    //   };
    // }

    // return {
    //   status: true,
    //   reviews,
    // };
  } catch (error) {
    return {
      status: false,
      error,
    };
  }
}
