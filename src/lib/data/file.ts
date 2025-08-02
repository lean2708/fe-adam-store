import { ControllerFactory } from "./factory-api-client";
import type {
  FileResponse,
  PageResponseFileResponse
} from "@/api-client/models";

/**
 * Get all files
 */
export async function fetchAllFiles(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,desc"]
): Promise<PageResponseFileResponse> {
  const controller = await ControllerFactory.getFileController();
  const response = await controller.getAllFiles({
    page,
    size,
    sort
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch files");
  }

  return response.data.result!;
}

/**
 * Upload multiple images
 */
export async function uploadImages(files: File[]): Promise<FileResponse[]> {
  const controller = await ControllerFactory.getFileController();
  const response = await controller.uploadImage({
    files
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to upload images");
  }

  return response.data.result || [];
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
