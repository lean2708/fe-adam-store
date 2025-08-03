import { FileControllerApi, FileControllerApiUploadImageRequest } from "@/api-client";
import { getAuthenticatedAxiosInstance } from "../auth/axios-config";

async function getFileController() {
  const axiosInstance = await getAuthenticatedAxiosInstance();
  return new FileControllerApi(undefined, undefined, axiosInstance);
}
export async function uploadFileApi( file: FileControllerApiUploadImageRequest) {
  const api = await getFileController();
  const response = await api.uploadImage(file);
  return response.data.result;
}
