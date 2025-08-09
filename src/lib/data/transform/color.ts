import type { ColorResponse, ApiResponsePageResponseColorResponse } from "@/api-client/models";
import { TColor } from "@/types";
import { ActionResponse } from "@/lib/types/actions";

/**
 * Transform API ColorResponse to TColor.
 */
export function transformColorResponseToTColor(apiColor: ColorResponse): TColor {
    return {
        id: apiColor.id ?? 0,
        name: apiColor.name ?? "",
        variants: [] // Will be populated when needed
    };
}

/**
 * Transform array of ColorResponse to TColor array
 */
export function transformColorArrayToTColorArray(apiColors: ColorResponse[]): TColor[] {
    return apiColors.map(transformColorResponseToTColor);
}

/**
 * Transform API response page response to ActionResponse for colors
 */
export function transformApiResponsePageResponseColorToActionResponse(
    apiResponse: ApiResponsePageResponseColorResponse
): ActionResponse<TColor[]> {
    return {
        success: true,
        message: "Colors fetched successfully",
        actionSizeResponse: {
            size: apiResponse.result?.size ?? 0,
            totalPages: apiResponse.result?.totalPages ?? 0,
            totalItems: apiResponse.result?.totalItems ?? 0
        },
        data: (apiResponse.result?.items ?? []).map(transformColorResponseToTColor)
    };
}
