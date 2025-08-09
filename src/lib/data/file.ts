import { ControllerFactory } from "./factory-api-client";
import type {
  FileResponse,
  PageResponseFileResponse
} from "@/api-client/models";
import { ActionResponse } from "../types/actions";
import { extractErrorMessage } from "../utils";
import { transformApiResponsePageResponseFileToActionResponse } from "./transform/file";

/**
 * Get all files
 */
export async function fetchAllFiles(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,desc"]
): Promise<ActionResponse<FileResponse[]>> {
  try {
    const controller = await ControllerFactory.getFileController();
    const response = await controller.getAllFiles({
      page,
      size,
      sort
    });

    return transformApiResponsePageResponseFileToActionResponse(response.data);
  } catch (error) {
    console.error("Error fetching files:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch files",
    };
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(files: File[]): Promise<ActionResponse<FileResponse[]>> {
  try {
    const controller = await ControllerFactory.getFileController();
    const response = await controller.uploadImage({
      files
    });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: response.data.result || [],
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Tải lên hình ảnh thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Delete a file
 */
export async function deleteFile(id: number): Promise<void> {
  const controller = await ControllerFactory.getFileController();
  const response = await controller.delete8({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to delete file");
  }
}
