"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type {
  UserCreationRequest,
  UserUpdateRequest,
  PageResponseUserResponse,
  PageResponseRoleResponse,
  PageResponsePromotionResponse,
} from "@/api-client/models";
import type { TUser } from "@/types";
import {
  fetchAllUsersForAdmin,
  searchUsersForAdmin,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  fetchUserById,
  fetchPromotionsbyUser,
  fetchAllRoles,
} from "@/lib/data/user";
import { extractErrorMessage } from "@/lib/utils";
import { changePassword1, getMyInfoApi } from "@/lib/data/auth";
import {
  userCreateSchema,
  UserUpdateFormData,
  userUpdateSchema,
  type UserCreateFormData,
} from "@/actions/schema/userSchema";

/**
 * Fetch all users for admin
 */
export async function fetchAllUsersAction(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<ActionResponse<TUser[]>> {
  try {
    const users = await fetchAllUsersForAdmin(page, size, sort);
    return users;
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
 * Search users for admin
 */
export async function searchUsersAction(
  page?: number,
  size?: number,
  sort?: string[],
  search?: string[]
): Promise<ActionResponse<TUser[]>> {
  try {
    const users = await searchUsersForAdmin(page, size, sort, search);
    return users;
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi tìm kiếm");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Create a new user with validation
 */
export async function createUserAction(
  formData: UserCreateFormData
): Promise<ActionResponse<TUser>> {
  try {
    // Validate the form data
    const validatedData = userCreateSchema.parse(formData);

    // Transform to API request format
    const userData: UserCreationRequest = {
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      roleIds: Array.from(validatedData.roleIds) as unknown as Set<number>,
    };

    const result = await createUser(userData);
    return result;
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        message: "Dữ liệu không hợp lệ",
      };
    }

    const extractedError = extractErrorMessage(error, "Lỗi server");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Update a user with validation
 */
export async function updateUserAction(
  id: number,
  formData: {
    name: string;
    dob: string;
    gender: string;
    roleIds?: Set<number>;
  }
): Promise<ActionResponse<TUser>> {
  try {
    const result = await updateUser(id, formData);
    return result;
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        message: "Dữ liệu không hợp lệ",
      };
    }

    const extractedError = extractErrorMessage(error, "Lỗi server");

    console.log(error);

    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Delete a user (soft delete)
 */
export async function deleteUserAction(
  id: number
): Promise<ActionResponse<void>> {
  try {
    await deleteUser(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}

/**
 * Restore a user
 */
export async function restoreUserAction(
  id: number
): Promise<ActionResponse<TUser>> {
  try {
    const result = await restoreUser(id);
    return result;
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
 * Fetch all roles
 */
export async function fetchAllRolesAction(
  page: number = 0,
  size: number = 100
): Promise<ActionResponse<PageResponseRoleResponse>> {
  try {
    const data = await fetchAllRoles(page, size);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch roles",
    };
  }
}

/**
 * Fetch all roles
 */
export async function fetchPromotionsbyUserAction(
  page: number = 0,
  size: number = 10
): Promise<ActionResponse<PageResponsePromotionResponse>> {
  try {
    const data = await fetchPromotionsbyUser(page, size);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch roles",
    };
  }
}

/**
 * Fetch user by ID
 */
export async function fetchUserByIdAction(
  id: number
): Promise<ActionResponse<TUser>> {
  try {
    const data = await fetchUserById(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}
export async function getInfoUser(): Promise<ActionResponse<TUser>> {
  try {
    const data = await getMyInfoApi();
    return {
      success: true,
      data,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      "Lỗi lấy thông tin người dùng"
    );
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

export async function changePasswordAction(newPass: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResponse<any>> {
  try {
    const data = await changePassword1(newPass);
    return {
      success: true,
      data,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Lỗi đổi mật khẩu");
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}
