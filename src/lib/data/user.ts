import { ControllerFactory } from "./factory-api-client";
import type {
  UserResponse,
  UserCreationRequest,
  PageResponseUserResponse,
  PageResponseRoleResponse,
  UserUpdateRequest
} from "@/api-client/models";
import { ActionResponse } from "../types/actions";
import { extractErrorMessage } from "../utils";
import { transformUserResponseToTUser, transformApiResponsePageResponseUserToActionResponse } from "./transform/user";

// Legacy function - keeping for backward compatibility
export async function fetchAllAddressUserApi() {
  const api = await ControllerFactory.getUserController();
  const response = await api.getAddressesByUser();
  return response.data.result;
}

/**
 * Fetch all users for admin with pagination
 */
export async function fetchAllUsersForAdmin(
  page: number = 0,
  size: number = 10,
  sort: string[] = ["id,desc"]
): Promise<ActionResponse<UserResponse[]>> {
  try {
    const controller = await ControllerFactory.getUserController();
    const response = await controller.fetchAllForAdmin({
      page,
      size,
      sort
    });

    return transformApiResponsePageResponseUserToActionResponse(response.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: UserCreationRequest): Promise<ActionResponse<UserResponse>> {
  try {
    const controller = await ControllerFactory.getUserController();
    const response = await controller.create4({
      userCreationRequest: userData
    });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformUserResponseToTUser(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Tạo người dùng thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Update a user
 */
export async function updateUser(
  id: number,
  userData: UserUpdateRequest
): Promise<ActionResponse<UserResponse>> {
  try {
    const controller = await ControllerFactory.getUserController();
    const response = await controller.update({
      id,
      userUpdateRequest: userData
    });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformUserResponseToTUser(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Cập nhật người dùng thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}


export async function changeAvatar(
  file: File
): Promise<UserResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.updateAvatar({
    file: file
  });
  return response.data.result!;
}
/**
 * Delete a user (soft delete)
 */
export async function deleteUser(id: number): Promise<void> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.delete2({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to delete user");
  }

}

/**
 * Restore a user
 */
export async function restoreUser(id: number): Promise<ActionResponse<UserResponse>> {
  try {
    const controller = await ControllerFactory.getUserController();
    const response = await controller.restore({ id });

    return {
      success: response.data.code === 200,
      message: response.data.message,
      data: transformUserResponseToTUser(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, "Khôi phục người dùng thất bại");
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Fetch user by ID
 */
export async function fetchUserById(id: number): Promise<UserResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.fetchById2({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch user");
  }

  return response.data.result!;
}

/**
 * Search users for admin with pagination
 * Search criteria format: field~value or field>value or field<value
 * Examples:
 * - name~john (contains "john")
 * - email~gmail.com (contains "gmail.com")
 * - status~ACTIVE (exact match)
 */
export async function searchUsersForAdmin(
  page: number = 0,
  size: number = 10,
  sort: string[] = ["id,desc"],
  search: string[] = []
): Promise<ActionResponse<UserResponse[]>> {
  try {
    const controller = await ControllerFactory.getUserController();
    const response = await controller.searchUser({
      page,
      size,
      sort,
      search
    });

    return transformApiResponsePageResponseUserToActionResponse(response.data);
  } catch (error) {
    console.error("Error searching users:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to search users",
    };
  }
}

/**
 * Fetch all roles
 */
export async function fetchAllRoles(
  page: number = 0,
  size: number = 100
): Promise<PageResponseRoleResponse> {
  const controller = await ControllerFactory.getRoleController();
  const response = await controller.fetchAll8({
    page,
    size
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch roles");
  }

  return response.data.result!;
}