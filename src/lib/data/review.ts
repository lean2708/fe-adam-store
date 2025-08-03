import { ReviewControllerApi } from "@/api-client";
import { getAuthenticatedAxiosInstance } from "../auth/axios-config";

async function getReviewController() {
  const axiosInstance = await getAuthenticatedAxiosInstance();
  return new ReviewControllerApi(undefined, undefined, axiosInstance);
}
export async function createReview(
  rating: number,
  comment: string,
  imageUrls: string[],
  productId: number
) {
  const api = await getReviewController();

  const cleanedImageUrls = imageUrls.filter((url): url is string => typeof url === 'string');

  const response = await api.create({
    reviewRequest: {
      rating,
      comment,
      imageUrls: cleanedImageUrls,
      productId
    }
  });

  return response.data.result;
}

export async function fetchReviewUserById(id: number) {
  const api = await getReviewController()
  const res = await api.getReview({ id })
  return res.data.result;
}