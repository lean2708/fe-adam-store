"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type { 
  PromotionResponse,
  PromotionRequest,
  PromotionUpdateRequest,
  PageResponsePromotionResponse
} from "@/api-client/models";
import {
  fetchAllPromotionsForAdmin,
  fetchPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  restorePromotion
} from "@/lib/data/promotion";

/**
 * Fetch all promotions for admin
 */
export async function fetchAllPromotionsForAdminAction(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,desc"]
): Promise<ActionResponse<PageResponsePromotionResponse>> {
  try {
    const data = await fetchAllPromotionsForAdmin(page, size, sort);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch promotions",
    };
  }
}

/**
 * Fetch promotion by ID
 */
export async function fetchPromotionByIdAction(id: number): Promise<ActionResponse<PromotionResponse>> {
  try {
    const data = await fetchPromotionById(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch promotion",
    };
  }
}

/**
 * Create a new promotion
 */
export async function createPromotionAction(
  promotionData: PromotionRequest
): Promise<ActionResponse<PromotionResponse>> {
  try {
    const data = await createPromotion(promotionData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create promotion",
    };
  }
}

/**
 * Update a promotion
 */
export async function updatePromotionAction(
  id: number,
  promotionData: PromotionUpdateRequest
): Promise<ActionResponse<PromotionResponse>> {
  try {
    const data = await updatePromotion(id, promotionData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update promotion",
    };
  }
}

/**
 * Delete a promotion
 */
export async function deletePromotionAction(id: number): Promise<ActionResponse<PromotionResponse>> {
  try {
    const data = await deletePromotion(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete promotion",
    };
  }
}

/**
 * Restore a promotion
 */
export async function restorePromotionAction(id: number): Promise<ActionResponse<PromotionResponse>> {
  try {
    const data = await restorePromotion(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to restore promotion",
    };
  }
}
