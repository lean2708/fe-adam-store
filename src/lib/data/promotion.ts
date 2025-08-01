import { ControllerFactory } from "./factory-api-client";
import type { 
  PromotionResponse,
  PromotionRequest,
  PromotionUpdateRequest,
  PageResponsePromotionResponse
} from "@/api-client/models";

/**
 * Helper to get an instance of PromotionControllerApi with NextAuth using factory.
 */
async function getPromotionController() {
  return await ControllerFactory.getPromotionController();
}

/**
 * Fetch all promotions for admin
 */
export async function fetchAllPromotionsForAdmin(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,desc"]
): Promise<PageResponsePromotionResponse> {
  const controller = await getPromotionController();
  const response = await controller.fetchAll9({
    page,
    size,
    sort
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch promotions");
  }

  return response.data.result!;
}

/**
 * Fetch promotion by ID
 */
export async function fetchPromotionById(id: number): Promise<PromotionResponse> {
  const controller = await getPromotionController();
  const response = await controller.fetchById4({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch promotion");
  }

  return response.data.result!;
}

/**
 * Create a new promotion (admin)
 */
export async function createPromotion(promotionData: PromotionRequest): Promise<PromotionResponse> {
  const controller = await getPromotionController();
  const response = await controller.create5({
    promotionRequest: promotionData
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to create promotion");
  }

  return response.data.result!;
}

/**
 * Update a promotion (admin)
 */
export async function updatePromotion(
  id: number,
  promotionData: PromotionUpdateRequest
): Promise<PromotionResponse> {
  const controller = await getPromotionController();
  const response = await controller.update4({
    id,
    promotionUpdateRequest: promotionData
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to update promotion");
  }

  return response.data.result!;
}

/**
 * Soft delete a promotion (admin)
 */
export async function deletePromotion(id: number): Promise<PromotionResponse> {
  const controller = await getPromotionController();
  const response = await controller.delete3({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to delete promotion");
  }

  return response.data.result!;
}

/**
 * Restore a deleted promotion (admin)
 */
export async function restorePromotion(id: number): Promise<PromotionResponse> {
  const controller = await getPromotionController();
  const response = await controller.restore1({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to restore promotion");
  }

  return response.data.result!;
}
