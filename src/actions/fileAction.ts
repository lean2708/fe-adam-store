"use server";

import { FileControllerApiUploadImageRequest } from "@/api-client";
import { uploadFileApi } from "@/lib/data/file";

export async function uploadFileAction(file:FileControllerApiUploadImageRequest) {
  try {
    const img = await uploadFileApi(file);
    return { status: 200, message: "Upload file", img};
  } catch (error) {
    return { status: 500, message: "Server error! Try later", error };
  }
}