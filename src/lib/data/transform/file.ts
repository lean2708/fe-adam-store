import type { FileResponse, ApiResponsePageResponseFileResponse } from "@/api-client/models";
import type { TFile } from "@/types";
import { ActionResponse } from "@/lib/types/actions";

/**
 * Transform API FileResponse to TFile.
 */
export function transformFileResponseToTFile(apiFile: FileResponse): TFile {
    return {
        id: apiFile.id,
        fileName: apiFile.fileName,
        imageUrl: apiFile.imageUrl,
        createdBy: apiFile.createdBy,
        createdAt: apiFile.createdAt
    };
}

/**
 * Transform array of FileResponse to TFile array
 */
export function transformFileArrayToTFileArray(apiFiles: FileResponse[]): TFile[] {
    return apiFiles.map(transformFileResponseToTFile);
}

/**
 * Transform API response page response to ActionResponse for files
 */
export function transformApiResponsePageResponseFileToActionResponse(
    apiResponse: ApiResponsePageResponseFileResponse
): ActionResponse<TFile[]> {
    return {
        success: true,
        message: "Files fetched successfully",
        actionSizeResponse: {
            size: apiResponse.result?.size ?? 0,
            totalPages: apiResponse.result?.totalPages ?? 0,
            totalItems: apiResponse.result?.totalItems ?? 0
        },
        data: (apiResponse.result?.items ?? []).map(transformFileResponseToTFile)
    };
}
