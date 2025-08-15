import { ControllerFactory } from "./factory-api-client";
import type {
  PromotionResponse,
  PromotionRequest,
  PromotionUpdateRequest,
  PageResponsePromotionResponse
} from "@/api-client/models";
import { ActionResponse } from "../types/actions";
import { extractErrorMessage } from "../utils";
import { transformPromotionResponseToTPromotion, transformApiResponsePageResponsePromotionToActionResponse } from "./transform/promotion";
import { TPromotion } from "@/types";

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
): Promise<ActionResponse<TPromotion[]>> {
  try {
    const controller = await getPromotionController();
    const response = await controller.fetchAll9({
      page,
      size,
      sort
    });

    return transformApiResponsePageResponsePromotionToActionResponse(response.data);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch promotions",
    };
  }
}

/**
 * Search promotions for admin with pagination
 * Search criteria format: field~value or field>value or field<value
 * Examples:
 * - name~sale (contains "sale")
 * - description~discount (contains "discount")
 * - status~ACTIVE (exact match)
 */
export async function searchPromotionsForAdmin(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,desc"],
  search: string[] = []
): Promise<ActionResponse<TPromotion[]>> {
  try {
    const controller = await getPromotionController();
    const response = await controller.searchPromotion({
      page,
      size,
      sort,
      search
    });

    return transformApiResponsePageResponsePromotionToActionResponse(response.data);
  } catch (error) {
    console.error("Error searching promotions:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to search promotions",
    };
  }
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
export async function createPromotion(promotionData: PromotionRequest): Promise<ActionResponse<TPromotion>> {
  try {
    const controller = await getPromotionController();
    const response = await controller.create5({
      promotionRequest: promotionData
    });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformPromotionResponseToTPromotion(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Tạo khuyến mãi thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Update a promotion (admin)
 */
export async function updatePromotion(
  id: number,
  promotionData: PromotionUpdateRequest
): Promise<ActionResponse<TPromotion>> {
  try {
    const controller = await getPromotionController();
    const response = await controller.update4({
      id,
      promotionUpdateRequest: promotionData
    });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformPromotionResponseToTPromotion(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Cập nhật khuyến mãi thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Soft delete a promotion (admin)
 */
export async function deletePromotion(id: number): Promise<ActionResponse<TPromotion>> {
  try {
    const controller = await getPromotionController();
    const response = await controller.delete3({ id });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformPromotionResponseToTPromotion(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Xóa khuyến mãi thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Restore a deleted promotion (admin)
 */
export async function restorePromotion(id: number): Promise<ActionResponse<TPromotion>> {
  try {
    const controller = await getPromotionController();
    const response = await controller.restore1({ id });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformPromotionResponseToTPromotion(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Khôi phục khuyến mãi thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}
