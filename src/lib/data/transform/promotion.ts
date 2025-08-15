import type { PromotionResponse, ApiResponsePageResponsePromotionResponse } from "@/api-client/models";
import { TPromotion } from "@/types";
import { ActionResponse } from "@/lib/types/actions";

/**
 * Transform API PromotionResponse to TPromotion.
 */
export function transformPromotionResponseToTPromotion(apiPromotion: PromotionResponse): TPromotion {
    return {
        id: apiPromotion.id ?? 0,
        code: apiPromotion.code,
        description: apiPromotion.description,
        discountPercent: apiPromotion.discountPercent,
        startDate: apiPromotion.startDate,
        endDate: apiPromotion.endDate,
        status: (apiPromotion.status as 'ACTIVE' | 'INACTIVE') || 'INACTIVE',
        createdBy: apiPromotion.createdBy,
        createdAt: apiPromotion.createdAt,
    };
}

/**
 * Transform array of PromotionResponse to TPromotion array
 */
export function transformPromotionArrayToTPromotionArray(apiPromotions: PromotionResponse[]): TPromotion[] {
    return apiPromotions.map(transformPromotionResponseToTPromotion);
}

/**
 * Transform API response page response to ActionResponse for promotions
 */
export function transformApiResponsePageResponsePromotionToActionResponse(
    apiResponse: ApiResponsePageResponsePromotionResponse
): ActionResponse<TPromotion[]> {
    return {
        success: true,
        message: "Promotions fetched successfully",
        actionSizeResponse: {
            size: apiResponse.result?.size ?? 0,
            totalPages: apiResponse.result?.totalPages ?? 0,
            totalItems: apiResponse.result?.totalItems ?? 0
        },
        data: (apiResponse.result?.items ?? []).map(transformPromotionResponseToTPromotion)
    };
}
