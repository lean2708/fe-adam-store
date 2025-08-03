import { ReviewControllerApi } from "@/api-client";
import { getAuthenticatedAxiosInstance } from "../auth/axios-config";

async function getReviewController() {
  const axiosInstance = await getAuthenticatedAxiosInstance();
  return new ReviewControllerApi(undefined, undefined, axiosInstance);
}
export async function createReview(
  rating: number,
  comment: string,
  imageUrls: (string | undefined)[],
  productId: number
) {
  const api = await getReviewController();
  const response = await api.create({rating, comment, imageUrls, productId});
  return response.data.result;
}

export async function fetchReviewUserById(id: number) {
  const api = await getReviewController()
  const res = await api.getReview({id})
  return res.data.result
}