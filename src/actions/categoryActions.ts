"use server";

import {
  fetchAllCategoriesApi,
  fetchAllProductByCategoryApi,
} from "@/lib/data/category";
import { categorySchema } from "./schema/categorySchema";
import { ApiResponsePageResponseProductResponse } from "@/api-client";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/webp"];

const schema = categorySchema;

export async function addCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const validatedFields = schema.safeParse({
    name,
    imageUrl,
  });

//   if (!validatedFields.success) {
//     return {
//       status: 403,
//       message: "data invalid",
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

  try {
    const created = await createCategoryApi({
      name,
      imageUrl: imageUrl || "",
    });
    return {
      status: 201,
      message: "New category created",
      category: created,
    };
  } catch (error) {
    return {
      status: 500,
      message: "create category failed",
      error,
    };
  }
}



export async function getAllCategoriesAction(page?: number, size?: number, sort?: string[]): Promise<ActionResponse<TCategory[]>> {
  try {
    const categories = await fetchAllCategoriesApi(page, size, sort);
    return categories;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi server");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

import { fetchAllCategoriesForAdminApi, createCategoryApi, updateCategoryApi, deleteCategoryApi, restoreCategoryApi } from "@/lib/data/category";
import type { ActionResponse } from "@/lib/types/actions";
import type { TCategory } from "@/types";
import type { CategoryRequest } from "@/api-client/models";
import { extractErrorMessage } from "@/lib/utils";

/**
 * Fetch all categories for admin
 */
export async function fetchAllCategoriesForAdminAction(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<ActionResponse<TCategory[]>> {
  try {
    const categories = await fetchAllCategoriesForAdminApi(page, size, sort);
    return categories;
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
 * Create a new category
 */
export async function createCategoryAction(categoryData: {
  name: string;
  status: string;
  imageUrl?: string;
}): Promise<ActionResponse<TCategory>> {
  try {
    const categoryRequest: CategoryRequest = {
      name: categoryData.name,
      imageUrl: categoryData.imageUrl || "",
    };

    const category = await createCategoryApi(categoryRequest);
    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

/**
 * Update an existing category
 */
export async function updateCategoryAction(
  id: number,
  categoryData: {
    name: string;
    status: string;
    imageUrl?: string;
  }
): Promise<ActionResponse<TCategory>> {
  try {
    const categoryRequest: CategoryRequest = {
      name: categoryData.name,
      imageUrl: categoryData.imageUrl || "",
    };

    const category = await updateCategoryApi(id, categoryRequest);
    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

/**
 * Delete a category
 */
export async function deleteCategoryAction(id: number): Promise<ActionResponse<void>> {
  try {
    await deleteCategoryApi(id);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}

/**
 * Restore a deleted category
 */
export async function restoreCategoryAction(id: number): Promise<ActionResponse<TCategory>> {
  try {
    const category = await restoreCategoryApi(id);
    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to restore category",
    };
  }
}

export const getProductByCategoryAction = async (
  categoryId: string,
  page: number,
  size: number,
  sort: string[]
) => {
  try {
    const data = await fetchAllProductByCategoryApi(
      categoryId,
      page,
      size,
      sort
    );
    if (data.code === 200) {
      return {
        status: true,
        data: data.result,
      };
    }
    return { status: false, message: "Not found product" };
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};
