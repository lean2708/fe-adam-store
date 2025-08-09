import type { FileResponse, ApiResponsePageResponseFileResponse } from "@/api-client/models";
import { ActionResponse } from "@/lib/types/actions";

/**
 * Transform API FileResponse to FileResponse (no transformation needed for now).
 */
export function transformFileResponseToFileResponse(apiFile: FileResponse): FileResponse {
    return apiFile;
}

/**
 * Transform array of FileResponse to FileResponse array
 */
export function transformFileArrayToFileArray(apiFiles: FileResponse[]): FileResponse[] {
    return apiFiles.map(transformFileResponseToFileResponse);
}

/**
 * Transform API response page response to ActionResponse for files
 */
export function transformApiResponsePageResponseFileToActionResponse(
    apiResponse: ApiResponsePageResponseFileResponse
): ActionResponse<FileResponse[]> {
    return {
        success: true,
        message: "Files fetched successfully",
        actionSizeResponse: {
            size: apiResponse.result?.size ?? 0,
            totalPages: apiResponse.result?.totalPages ?? 0,
            totalItems: apiResponse.result?.totalItems ?? 0
        },
        data: (apiResponse.result?.items ?? []).map(transformFileResponseToFileResponse)
    };
}
