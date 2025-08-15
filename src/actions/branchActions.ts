"use server";

import {
  createBranchApi,
  deleteBranchApi,
  fetchAllBranchesApi,
  fetchBranchByIdApi,
  updateBranchApi,
  fetchActiveBranchesApi,
  restoreBranchesApi,
} from "@/lib/data/branch";
import { branchSchema, updateBranchSchema } from "./schema/branchSchema";
import type { ActionResponse } from "@/lib/types/actions";
import { extractErrorMessage } from "@/lib/utils";
import { TBranch } from "@/types";

/**
 * Create a new branch
 */
export async function addBranchAction(formData: FormData): Promise<ActionResponse<TBranch>> {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const phone = formData.get("phone") as string;

  const validatedFields = branchSchema.safeParse({ name, location, phone, });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const created = await createBranchApi({ name, location, phone, });
  return created
}

/**
 * Update an existing branch
 */
export async function updateBranchAction(branchId: string, formData: FormData): Promise<ActionResponse<TBranch>> {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const phone = formData.get("phone") as string;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (location) updateData.location = location;
  if (phone) updateData.phone = phone;

  const validatedFields = updateBranchSchema.safeParse(updateData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const updated = await updateBranchApi(branchId, updateData);
  return updated;
}

/**
 * Delete a branch
 */
export async function deleteBranchAction(branchId: string): Promise<ActionResponse> {
  try {
    const deleted = await deleteBranchApi(Number(branchId));
    return {
      success: deleted.code === 204,
      message: deleted.message,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Xóa chi nhánh thất bại");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Get all branches
 */
export async function getAllBranchesAction(page?: number, size?: number, sort?: string[]): Promise<ActionResponse<TBranch[]>> {
  try {
    const branches = await fetchAllBranchesApi(page, size, sort);
    return branches;
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
 * Get a single branch by ID
 */
export async function getBranchByIdAction(branchId: string): Promise<ActionResponse<TBranch>> {
  try {
    const branch = await fetchBranchByIdApi(branchId);

    if (!branch) {
      return {
        success: false,
        message: "Không tìm thấy chi nhánh",
      };
    }

    return {
      success: true,
      data: branch,
    };
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
 * Get active branches only (for public display)
 */
export async function getActiveBranchesAction(): Promise<ActionResponse<TBranch[]>> {
  try {
    const branches = await fetchActiveBranchesApi();
    return {
      success: true,
      data: branches,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi server");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

export async function restoreBranchesAction(branchId: string): Promise<ActionResponse<TBranch>> {
  try {
    const data = await restoreBranchesApi(Number(branchId));
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to restore promotion",
    };
  }
}
