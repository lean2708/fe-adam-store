import { ControllerFactory } from "./factory-api-client";
import { getPublicAxiosInstance } from "@/lib/auth/axios-config";
import { SizeControllerApi } from "@/api-client";
import type { 
  PageResponseSizeResponse
} from "@/api-client/models";

/**
 * Helper to get an instance of SizeControllerApi with NextAuth using factory.
 */
async function getSizeController() {
  return await ControllerFactory.getSizeController();
}

/**
 * Helper to get a public instance of SizeControllerApi (no auth).
 */
function getPublicSizeController() {
  const axiosInstance = getPublicAxiosInstance();
  return new SizeControllerApi(undefined, undefined, axiosInstance);
}

/**
 * Fetch all sizes (public endpoint)
 */
export async function fetchAllSizes(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,asc"]
): Promise<PageResponseSizeResponse> {
  const controller = getPublicSizeController();
  const response = await controller.fetchAll({
    page,
    size,
    sort
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch sizes");
  }

  return response.data.result!;
}
