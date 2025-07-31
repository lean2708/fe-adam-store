"use server";

import { z } from "zod";
import {
  createBranchApi,
  deleteBranchApi,
  fetchAllBranchesApi,
  fetchBranchByIdApi,
  updateBranchApi,
  fetchActiveBranchesApi,
} from "@/lib/data/branch";
import { branchSchema, updateBranchSchema } from "./schema/branchSchema";

/**
 * Create a new branch
 */
export async function addBranchAction(formData: FormData) {
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
      status: 403,
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
        status: 500,
        message: "Không thể tạo chi nhánh",
      };
    }

    return {
      status: 201,
      message: "Tạo chi nhánh thành công",
      branch: created,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Tạo chi nhánh thất bại",
      error,
    };
  }
}

/**
 * Update an existing branch
 */
export async function updateBranchAction(branchId: string, formData: FormData) {
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
      status: 403,
      message: "Dữ liệu không hợp lệ",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const updated = await updateBranchApi(branchId, updateData);

    if (!updated) {
      return {
        status: 500,
        message: "Không thể cập nhật chi nhánh",
      };
    }

    return {
      status: 200,
      message: "Cập nhật chi nhánh thành công",
      branch: updated,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Cập nhật chi nhánh thất bại",
      error,
    };
  }
}

/**
 * Delete a branch
 */
export async function deleteBranchAction(branchId: string) {
  try {
    const deleted = await deleteBranchApi(Number(branchId));
    
    if (!deleted) {
      return {
        status: 500,
        message: "Không thể xóa chi nhánh",
      };
    }

    return {
      status: 200,
      message: "Xóa chi nhánh thành công",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Xóa chi nhánh thất bại",
      error,
    };
  }
}

/**
 * Get all branches
 */
export async function getAllBranchesAction(page?: number, size?: number, sort?: string[]) {
  try {
    const branches = await fetchAllBranchesApi(page, size, sort);
    return {
      status: 200,
      branches,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Lỗi server",
      error,
    };
  }
}

/**
 * Get a single branch by ID
 */
export async function getBranchByIdAction(branchId: string) {
  try {
    const branch = await fetchBranchByIdApi(branchId);
    
    if (!branch) {
      return {
        status: 404,
        message: "Không tìm thấy chi nhánh",
      };
    }

    return {
      status: 200,
      branch,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Lỗi server",
      error,
    };
  }
}

/**
 * Get active branches only (for public display)
 */
export async function getActiveBranchesAction() {
  try {
    const branches = await fetchActiveBranchesApi();
    return {
      status: 200,
      branches,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Lỗi server",
      error,
    };
  }
}
