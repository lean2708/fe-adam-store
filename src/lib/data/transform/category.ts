import type { CategoryResponse, ApiResponsePageResponseCategoryResponse } from "@/api-client/models";
import { TCategory } from "@/types";
import { ActionResponse } from "@/lib/types/actions";

/**
 * Transform API CategoryResponse to TCategory.
 */
export function transformCategoryResponseToTCategory(apiCategory: CategoryResponse): TCategory {
    return {
        id: apiCategory.id ?? 0,
        name: apiCategory.name ?? "",
        imageUrl: apiCategory.imageUrl ?? "",
        status: apiCategory.status,
        createdBy: apiCategory.createdBy,
        updatedBy: apiCategory.updatedBy,
        createdAt: apiCategory.createdAt,
        updatedAt: apiCategory.updatedAt,
    };
}

/**
 * Transform array of CategoryResponse to TCategory array
 */
export function transformCategoryArrayToTCategoryArray(apiCategories: CategoryResponse[]): TCategory[] {
    return apiCategories.map(transformCategoryResponseToTCategory);
}

/**
 * Transform API response page response to ActionResponse for categories
 */
export function transformApiResponsePageResponseCategoryToActionResponse(
    apiResponse: ApiResponsePageResponseCategoryResponse
): ActionResponse<TCategory[]> {
    return {
        success: true,
        message: "Categories fetched successfully",
        actionSizeResponse: {
            size: apiResponse.result?.size ?? 0,
            totalPages: apiResponse.result?.totalPages ?? 0,
            totalItems: apiResponse.result?.totalItems ?? 0
        },
        data: (apiResponse.result?.items ?? []).map(transformCategoryResponseToTCategory)
    };
}
