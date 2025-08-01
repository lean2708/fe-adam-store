import { ControllerFactory } from "./factory-api-client";
import { getPublicAxiosInstance } from "@/lib/auth/axios-config";
import { ColorControllerApi } from "@/api-client";
import type { 
  ColorResponse,
  ColorRequest,
  PageResponseColorResponse
} from "@/api-client/models";

/**
 * Helper to get an instance of ColorControllerApi with NextAuth using factory.
 */
async function getColorController() {
  return await ControllerFactory.getColorController();
}

/**
 * Helper to get a public instance of ColorControllerApi (no auth).
 */
function getPublicColorController() {
  const axiosInstance = getPublicAxiosInstance();
  return new ColorControllerApi(undefined, undefined, axiosInstance);
}

/**
 * Fetch all colors (public endpoint)
 */
export async function fetchAllColors(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,asc"]
): Promise<PageResponseColorResponse> {
  const controller = getPublicColorController();
  const response = await controller.fetchAll2({
    page,
    size,
    sort
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch colors");
  }

  return response.data.result!;
}

/**
 * Create a new color (admin)
 */
export async function createColor(colorData: ColorRequest): Promise<ColorResponse> {
  const controller = await getColorController();
  const response = await controller.create7({
    colorRequest: colorData
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to create color");
  }

  return response.data.result!;
}

/**
 * Update a color (admin)
 */
export async function updateColor(
  id: number,
  colorData: ColorRequest
): Promise<ColorResponse> {
  const controller = await getColorController();
  const response = await controller.update6({
    id,
    colorRequest: colorData
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to update color");
  }

  return response.data.result!;
}

/**
 * Delete a color (admin)
 */
export async function deleteColor(id: number): Promise<void> {
  const controller = await getColorController();
  const response = await controller.delete9({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to delete color");
  }
}
