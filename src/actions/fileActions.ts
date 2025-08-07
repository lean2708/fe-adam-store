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
import { changeAvatar } from "@/lib/data/user";

/**
 * Get all files
 */
export async function getAllFilesAction(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,desc"]
): Promise<ActionResponse<PageResponseFileResponse>> {
  try {
    const data = await fetchAllFiles(page, size, sort);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch files",
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
    const data = await uploadImages(files);
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
