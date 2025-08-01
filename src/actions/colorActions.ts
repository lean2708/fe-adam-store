"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type { 
  ColorResponse,
  ColorRequest,
  PageResponseColorResponse
} from "@/api-client/models";
import {
  fetchAllColors,
  createColor,
  updateColor,
  deleteColor
} from "@/lib/data/color";

/**
 * Fetch all colors
 */
export async function fetchAllColorsAction(
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,asc"]
): Promise<ActionResponse<PageResponseColorResponse>> {
  try {
    const data = await fetchAllColors(page, size, sort);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch colors",
    };
  }
}

/**
 * Create a new color
 */
export async function createColorAction(
  colorData: ColorRequest
): Promise<ActionResponse<ColorResponse>> {
  try {
    const data = await createColor(colorData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create color",
    };
  }
}

/**
 * Update a color
 */
export async function updateColorAction(
  id: number,
  colorData: ColorRequest
): Promise<ActionResponse<ColorResponse>> {
  try {
    const data = await updateColor(id, colorData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update color",
    };
  }
}

/**
 * Delete a color
 */
export async function deleteColorAction(
  id: number
): Promise<ActionResponse<void>> {
  try {
    await deleteColor(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete color",
    };
  }
}
