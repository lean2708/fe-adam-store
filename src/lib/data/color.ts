import { ControllerFactory } from "./factory-api-client";
import { getPublicAxiosInstance } from "@/lib/auth/axios-config";
import { ColorControllerApi } from "@/api-client";
import type {
  ColorResponse,
  ColorRequest,
  PageResponseColorResponse
} from "@/api-client/models";
import { ActionResponse } from "../types/actions";
import { extractErrorMessage } from "../utils";
import { transformColorResponseToTColor, transformApiResponsePageResponseColorToActionResponse } from "./transform/color";
import { TColor } from "@/types";

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
): Promise<ActionResponse<TColor[]>> {
  try {
    const controller = getPublicColorController();
    const response = await controller.fetchAll2({
      page,
      size,
      sort
    });

    return transformApiResponsePageResponseColorToActionResponse(response.data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch colors",
    };
  }
}

/**
 * Create a new color (admin)
 */
export async function createColor(colorData: ColorRequest): Promise<ActionResponse<TColor>> {
  try {
    const controller = await getColorController();
    const response = await controller.create7({
      colorRequest: colorData
    });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformColorResponseToTColor(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Tạo màu thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Update a color (admin)
 */
export async function updateColor(
  id: number,
  colorData: ColorRequest
): Promise<ActionResponse<TColor>> {
  try {
    const controller = await getColorController();
    const response = await controller.update6({
      id,
      colorRequest: colorData
    });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformColorResponseToTColor(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Cập nhật màu thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
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
