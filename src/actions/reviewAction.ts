'use server';

import { createReview, fetchReviewUserById } from "@/lib/data/review";

export async function createReviewAction(
  rating: number,
  comment: string,
  imageUrls: string[],
  productId: number) {
  try {
    const review = await createReview(rating, comment, imageUrls, productId);
    return { status: 200, message: "Create review", review };
  } catch (error) {
    return { status: 500, message: "Server error! Try later", error };
  }
}
export async function getReviewAction(id: number) {
  try {
    const review = await fetchReviewUserById(id)
     return { status: 200, message: "Get review", review };
  } catch (error) {
     return { status: 500, message: "Server error! Try later", error };
  }
}