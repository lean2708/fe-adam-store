"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type {
  PromotionRequest,
  PromotionUpdateRequest
} from "@/api-client/models";
import type { TPromotion } from "@/types";
import {
  fetchAllPromotionsForAdmin,
  searchPromotionsForAdmin,
  fetchPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  restorePromotion
} from "@/lib/data/promotion";
import { extractErrorMessage } from "@/lib/utils";

/**
 * Fetch all promotions for admin
 */
export async function fetchAllPromotionsForAdminAction(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<ActionResponse<TPromotion[]>> {
  try {
    const promotions = await fetchAllPromotionsForAdmin(page, size, sort);
    return promotions;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi server");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Search promotions for admin
 */
export async function searchPromotionsAction(
  page?: number,
  size?: number,
  sort?: string[],
  search?: string[]
): Promise<ActionResponse<TPromotion[]>> {
  try {
    const promotions = await searchPromotionsForAdmin(page, size, sort, search);
    return promotions;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi tìm kiếm");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}



/**
 * Create a new promotion
 */
export async function createPromotionAction(
  promotionData: PromotionRequest
): Promise<ActionResponse<TPromotion>> {
  try {
    const result = await createPromotion(promotionData);
    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi server");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Update a promotion
 */
export async function updatePromotionAction(
  id: number,
  promotionData: PromotionUpdateRequest
): Promise<ActionResponse<TPromotion>> {
  try {
    const result = await updatePromotion(id, promotionData);
    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi server");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Delete a promotion
 */
export async function deletePromotionAction(id: number): Promise<ActionResponse<TPromotion>> {
  try {
    const result = await deletePromotion(id);
    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi server");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Restore a promotion
 */
export async function restorePromotionAction(id: number): Promise<ActionResponse<TPromotion>> {
  try {
    const result = await restorePromotion(id);
    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi server");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}
