'use server';

import type { ActionResponse } from '@/lib/types/actions';
import type {
  UserResponse,
  UserCreationRequest,
  UserUpdateRequest,
  PageResponseUserResponse,
  PageResponseRoleResponse,
  PageResponsePromotionResponse,
} from '@/api-client/models';
import {
  fetchAllUsersForAdmin,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  fetchUserById,
  fetchAllRoles,
  fetchPromotionsbyUser,
} from '@/lib/data/user';
import { changePassword1, getMyInfoApi } from '@/lib/data/auth';

/**
 * Fetch all users for admin
 */
export async function fetchAllUsersAction(
  page: number = 0,
  size: number = 10,
  sort: string[] = ['id,desc']
): Promise<ActionResponse<PageResponseUserResponse>> {
  try {
    const data = await fetchAllUsersForAdmin(page, size, sort);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    };
  }
}

/**
 * Create a new user
 */
export async function createUserAction(
  userData: UserCreationRequest
): Promise<ActionResponse<UserResponse>> {
  try {
    const data = await createUser(userData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
}

/**
 * Update a user
 */
export async function updateUserAction(
  id: number,
  userData: {
    name: string;
    dob?: string;
    gender: string;
    roleIds: number[];
  }
) {
  try {
    const data = await updateUser(id, userData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error occurred during user update:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update user',
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
      message: error instanceof Error ? error.message : 'Failed to delete user',
    };
  }
}

/**
 * Restore a user
 */
export async function restoreUserAction(
  id: number
): Promise<ActionResponse<UserResponse>> {
  try {
    const data = await restoreUser(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to restore user',
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
      message: error instanceof Error ? error.message : 'Failed to fetch roles',
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
      message: error instanceof Error ? error.message : 'Failed to fetch roles',
    };
  }
}

/**
 * Fetch user by ID
 */
export async function fetchUserByIdAction(
  id: number
): Promise<ActionResponse<UserResponse>> {
  try {
    const data = await fetchUserById(id);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch user',
    };
  }
}

export async function getInfoUser() {
  try {
    const data = await getMyInfoApi();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch user',
    };
  }
}

export async function changePasswordAction(newPass: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const data = await changePassword1(newPass);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch user',
    };
  }
}
