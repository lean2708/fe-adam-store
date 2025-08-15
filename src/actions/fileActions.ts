"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type {
  PageResponseFileResponse
} from "@/api-client/models";
import type { TFile } from "@/types";
import {
  fetchAllFiles,
  uploadImages,
  deleteFile
} from "@/lib/data/file";
import { extractErrorMessage } from "@/lib/utils";
import { changeAvatar } from "@/lib/data/user";

/**
 * Get all files
 */
export async function getAllFilesAction(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<ActionResponse<TFile[]>> {
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
): Promise<ActionResponse<TFile[]>> {
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
export async function changeAvatarAction(
  file: File
) {
  try {
    const data = await changeAvatar(file);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload images",
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
