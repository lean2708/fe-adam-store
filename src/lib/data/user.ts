import { ControllerFactory } from './factory-api-client';
import type {
  UserResponse,
  UserCreationRequest,
  PageResponseUserResponse,
  PageResponseRoleResponse,
  PageResponsePromotionResponse,
} from '@/api-client/models';

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
  sort: string[] = ['id,desc']
): Promise<PageResponseUserResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.fetchAllForAdmin({
    page,
    size,
    sort,
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to fetch users');
  }

  return response.data.result!;
}

/**
 * Fetch all promotions available for user
 */
export async function fetchPromotionsbyUser(
  page: number = 0,
  size: number = 100
): Promise<PageResponsePromotionResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.getPromotionsByUser({
    page,
    size,
  });

  if (response.data.code !== 200) {
    throw new Error(
      response.data.message || 'Failed to fetch promotion by user'
    );
  }

  return response.data.result!;
}

/**
 * Create a new user
 */
export async function createUser(
  userData: UserCreationRequest
): Promise<UserResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.create4({
    userCreationRequest: userData,
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to create user');
  }

  return response.data.result!;
}

/**
 * Update a user
 */
export async function updateUser(
  id: number,
  userData: {
    name: string;
    dob?: string;
    gender: string;
    roleIds: number[];
  }
): Promise<UserResponse> {
  const api = await ControllerFactory.getUserController();
  const response = await api.update({ id: id, userUpdateRequest: userData });
  return response.data.result!;
}

export async function changeAvatar(file: File): Promise<UserResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.updateAvatar({
    file: file,
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
    throw new Error(response.data.message || 'Failed to delete user');
  }
}

/**
 * Restore a user
 */
export async function restoreUser(id: number): Promise<UserResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.restore({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to restore user');
  }

  return response.data.result!;
}

/**
 * Fetch user by ID
 */
export async function fetchUserById(id: number): Promise<UserResponse> {
  const controller = await ControllerFactory.getUserController();
  const response = await controller.fetchById2({ id });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to fetch user');
  }

  return response.data.result!;
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
    size,
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to fetch roles');
  }

  return response.data.result!;
}
