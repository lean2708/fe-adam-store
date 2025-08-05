import type { ApiResponsePageResponseSizeResponse, SizeResponse } from "@/api-client/models";
import { ActionResponse } from "@/lib/types/actions";
import { TProduct, TColor, TVariant, TSize } from "@/types";

export function transformSizeResponseToTSize(
    apiSize: SizeResponse
): TSize {

    return {
        id: apiSize.id ?? 0,
        name: apiSize.name ?? "",
    };
}

export function transformApiResponsePageResponseSizeToActionResponse(
    apiResponse: ApiResponsePageResponseSizeResponse
): ActionResponse<TSize[]> {

    return {
        success: true,
        message: "Sizes fetched successfully",
        actionSizeResponse: {
            size: apiResponse.result?.size ?? 0,
            totalPages: apiResponse.result?.totalPages ?? 0,
            totalItems: apiResponse.result?.totalItems ?? 0
        },
        data: (apiResponse.result?.items ?? []).map(transformSizeResponseToTSize)
    };
}
