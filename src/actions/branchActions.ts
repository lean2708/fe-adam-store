"use server";

import {
  createBranchApi,
  deleteBranchApi,
  fetchAllBranchesApi,
  fetchBranchByIdApi,
  updateBranchApi,
  fetchActiveBranchesApi,
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

  const validatedFields = branchSchema.safeParse({
    name,
    location,
    phone,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const created = await createBranchApi({
      name,
      location,
      phone,
    });

    if (!created) {
      return {
        success: false,
        message: "Không thể tạo chi nhánh",
      };
    }

    return {
      success: true,
      message: "Tạo chi nhánh thành công",
      data: created,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Tạo chi nhánh thất bại");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
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

  try {
    const updated = await updateBranchApi(branchId, updateData);

    if (!updated) {
      return {
        success: false,
        message: "Không thể cập nhật chi nhánh",
      };
    }

    return {
      success: true,
      message: "Cập nhật chi nhánh thành công",
      data: updated,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Cập nhật chi nhánh thất bại");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Delete a branch
 */
export async function deleteBranchAction(branchId: string): Promise<ActionResponse> {
  try {
    const deleted = await deleteBranchApi(Number(branchId));

    if (!deleted) {
      return {
        success: false,
        message: "Không thể xóa chi nhánh",
      };
    }

    return {
      success: true,
      message: "Xóa chi nhánh thành công",
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
