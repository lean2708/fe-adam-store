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
import { transformColorResponse, transformColorResponses } from "@/lib/transformations";

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
    const created = await createColor({
      name,
    });

    if (!created) {
      return {
        success: false,
        message: "Không thể tạo màu",
      };
    }

    return {
      success: true,
      message: "Tạo màu thành công",
      data: transformColorResponse(created),
    };
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
    const updated = await updateColor(parseInt(colorId), updateData);

    if (!updated) {
      return {
        success: false,
        message: "Không thể cập nhật màu",
      };
    }

    return {
      success: true,
      message: "Cập nhật màu thành công",
      data: transformColorResponse(updated),
    };
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
  page: number = 0,
  size: number = 20,
  sort: string[] = ["id,asc"]
): Promise<ActionResponse<{ items: TColor[]; totalItems: number; totalPages: number }>> {
  try {
    const data = await fetchAllColors(page, size, sort);
    return {
      success: true,
      data: {
        items: transformColorResponses(data.items || []),
        totalItems: data.totalItems || 0,
        totalPages: data.totalPages || 0
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch colors",
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
