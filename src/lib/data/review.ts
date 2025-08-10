import { ControllerFactory } from "./factory-api-client";

async function getReviewController() {
  return await ControllerFactory.getReviewController();
}

export async function fetchProductReviewsApi(
    id: number
  ){
  const api = await getReviewController();
  const response = await api.getByOrderItemId({orderItemId: id})
  return response.data.result;
}

export async function checkProductReviewsApi(
    id: number
  ){
  const api = await getReviewController();
  const response = await api.isOrderItemReviewedByUser({orderItemId: id})
  return response.data.result;
}

export async function createProductReviewsApi(
  rating: number,
  comment: string,
  imageUrls: string[],
  productId: number
) {
  const api = await getReviewController();
  const response = await api.create({
    reviewRequest: {
      rating: rating,
      comment: comment,
      imageUrls: imageUrls,
      orderItemId: productId
    }
  });
  return response.data.result;
}





export async function updateProductReviewsApi(rating: number,
  comment: string,
  imageUrls: string[],
  productId: number) {
  const api = await getReviewController();
  const response = await api.update1({
    id: productId,
    reviewUpdateRequest: {
      rating: rating,
      comment: comment,
      imageUrls: imageUrls
    }
  });
  return response.data.result;
}
