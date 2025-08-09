"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type {
  FileResponse,
  PageResponseFileResponse
} from "@/api-client/models";
import {
  fetchAllFiles,
  uploadImages,
  deleteFile
} from "@/lib/data/file";
import { extractErrorMessage } from "@/lib/utils";

/**
 * Get all files
 */
export async function getAllFilesAction(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<ActionResponse<FileResponse[]>> {
  try {
    const files = await fetchAllFiles(page, size, sort);
    return files;
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
 * Upload images
 */
export async function uploadImagesAction(
  files: File[]
): Promise<ActionResponse<FileResponse[]>> {
  try {
    const result = await uploadImages(files);
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
 * Delete a file
 */
export async function deleteFileAction(
  id: number
): Promise<ActionResponse<void>> {
  try {
    await deleteFile(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
}
