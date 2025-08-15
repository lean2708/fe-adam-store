"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type { TColor } from "@/types";
import {
  fetchAllColors,
  createColor,
  updateColor,
  deleteColor
} from "@/lib/data/color";
import { colorSchema, updateColorSchema } from "./schema/colorSchema";
import { extractErrorMessage } from "@/lib/utils";

/**
 * Create a new color
 */
export async function addColorAction(formData: FormData): Promise<ActionResponse<TColor>> {
  const name = formData.get("name") as string;

  const validatedFields = colorSchema.safeParse({
    name,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await createColor({
      name,
    });

    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Tạo màu thất bại");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Update an existing color
 */
export async function updateColorAction(colorId: string, formData: FormData): Promise<ActionResponse<TColor>> {
  const name = formData.get("name") as string;

  const updateData: any = {};
  if (name) updateData.name = name;

  const validatedFields = updateColorSchema.safeParse(updateData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await updateColor(parseInt(colorId), updateData);

    return result;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Cập nhật màu thất bại");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Fetch all colors
 */
export async function fetchAllColorsAction(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<ActionResponse<TColor[]>> {
  try {
    const colors = await fetchAllColors(page, size, sort);
    return colors;
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
 * Delete a color
 */
export async function deleteColorAction(colorId: string): Promise<ActionResponse<void>> {
  try {
    await deleteColor(parseInt(colorId));
    return {
      success: true,
      message: "Xóa màu thành công",
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Xóa màu thất bại");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}
