import { ApiResponseVoid, BranchControllerApi } from '@/api-client';
import { getPublicAxiosInstance } from '@/lib/auth/axios-config';
import { TBranch } from '@/types';
import { ControllerFactory } from './factory-api-client';
import {
  transformBranchResponseToTBranch,
  transformBranchArrayToTBranchArray,
  transformApiResponsePageResponseSizeToActionResponse,
} from './transform/branch';
import { ActionResponse } from '../types/actions';
import { extractErrorMessage } from '../utils';

/**
 * Helper to get an instance of BranchControllerApi with NextAuth using factory.
 */
async function getBranchController() {
  return await ControllerFactory.getBranchController();
}

/**
 *
 * Helper to get an instance of BranchControllerApi for public endpoints.
 */
function getPublicBranchController() {
  const axiosInstance = getPublicAxiosInstance();
  return new BranchControllerApi(undefined, undefined, axiosInstance);
}

/**
 * Fetch all branches from the API
 */
export async function fetchAllBranchesApi(
  page?: number,
  size?: number,
  sort?: string[]
): Promise<ActionResponse<TBranch[]>> {
  try {
    const api = await getBranchController();
    const response = await api.fetchAllBranchesForAdmin({
      page,
      size,
      sort,
    });

    return transformApiResponsePageResponseSizeToActionResponse(response.data);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch sizes',
    };
  }
}

/**
 * Fetch a single branch by ID
 */
export async function fetchBranchByIdApi(id: string): Promise<TBranch | null> {
  try {
    const api = getPublicBranchController();
    const response = await api.fetchById({
      id: parseInt(id),
    });

    const branch = response.data?.result;
    if (!branch) return null;

    return transformBranchResponseToTBranch(branch);
  } catch (error) {
    console.error('Error fetching branch:', error);
    return null;
  }
}

/**
 * Create a new branch
 */
export async function createBranchApi(branchData: {
  name: string;
  location: string;
  phone: string;
}): Promise<ActionResponse<TBranch>> {
  try {
    const api = await getBranchController();
    const response = await api.create9({
      branchRequest: {
        name: branchData.name,
        location: branchData.location,
        phone: branchData.phone,
      },
    });

    return {
      success: response.data.code == 201,
      message: response.data.message,
      data: transformBranchResponseToTBranch(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(error, 'Tạo chi nhánh thất bại');
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Update an existing branch
 */
export async function updateBranchApi(
  id: string,
  branchData: {
    name?: string;
    location?: string;
    phone?: string;
  }
): Promise<ActionResponse<TBranch>> {
  try {
    const api = await getBranchController();
    const response = await api.update8({
      id: parseInt(id),
      branchUpdateRequest: {
        name: branchData.name,
        location: branchData.location,
        phone: branchData.phone,
      },
    });
    return {
      success: response.data.code == 200,
      message: response.data.message,
      data: transformBranchResponseToTBranch(response.data?.result || {}),
      code: response.data.code,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'Cập nhật nhánh thất bại'
    );
    return {
      success: false,
      message: extractedError.message,
      code: 500,
    };
  }
}

/**
 * Delete a branch
 */
export async function deleteBranchApi(id: number): Promise<ApiResponseVoid> {
  try {
    const api = await getBranchController();
    const result = await api.delete11({
      id,
    });

    return result.data;
  } catch (error) {
    console.error('Error deleting branch:', error);
    return {
      code: 500,
      message: 'Failed to delete branch',
    };
  }
}

/**
 * Fetch active branches only (for public display)
 */
export async function fetchActiveBranchesApi(): Promise<TBranch[]> {
  try {
    const api = getPublicBranchController();
    const response = await api.fetchAll4({});

    // Transform API response to TBranch format
    const branches = response.data?.result?.items || [];

    return transformBranchArrayToTBranchArray(branches);
  } catch (error) {
    console.error('Error fetching active branches:', error);
    return [];
  }
}
export async function restoreBranchesApi(id: number): Promise<TBranch> {
  const api = await getBranchController();
  const response = await api.restore5({ id });
  if (response.data.code !== 200) {
    throw response.data;
  }
  if (!response.data.result) throw new Error('No category returned');
  return transformBranchResponseToTBranch(response.data.result);
}
