"use server";

import { z } from "zod";
import {
  createCategoryApi,
  deleteCategoryApi,
  fetchAllCategoriesApi,
  fetchAllProductByCategoryApi,
} from "@/lib/data/category";
import { categorySchema } from "./schema/categorySchema";
import { ApiResponsePageResponseProductResponse } from "@/api-client";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/webp"];

const schema = categorySchema;

export async function addCategoryAction(formData: FormData) {
  const title = formData.get("title") as string;
  const image = formData.get("image") as File;

  const validatedFields = schema.safeParse({
    title,
    image,
  });

  if (!validatedFields.success) {
    return {
      status: 403,
      message: "data invalid",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // NOTE: You must implement or import an image upload API for image.
  // Here we just pass the image file name as a placeholder.
  // Replace this with your actual upload logic.
  const imagePath =
    typeof image === "object" && "name" in image ? image.name : "";

  try {
    const created = await createCategoryApi({
      title,
      image: imagePath,
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

export async function deleteCategoryAction(categoryId: string) {
  try {
    const deleted = await deleteCategoryApi(Number(categoryId));
    return {
      status: 202,
      message: "Delete category successfully",
      deleted,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Delete category failed",
      error,
    };
  }
}

export async function getAllCategoriesAction(
  page?: number,
  size?: number,
  sort?: string[]
) {
  try {
    const categories = await fetchAllCategoriesApi(page, size, sort);
    return {
      status: 200,
      categories,
    };
  } catch (error) {
    return {
      status: 500,
      message: "server error",
      error,
    };
  }
}

export const getProductByCategoryAction = async ({
  categoryId,
  page,
  size,
  sort,
}: {
  categoryId: string;
  page?: number;
  size?: number;
  sort: string[];
}): Promise<ApiResponsePageResponseProductResponse> => {
  try {
    const data = await fetchAllProductByCategoryApi(
      categoryId,
      page,
      size,
      sort
    );
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};
