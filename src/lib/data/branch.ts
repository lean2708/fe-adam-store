import { BranchControllerApi } from "@/api-client";
import { getPublicAxiosInstance } from "@/lib/auth/axios-config";
import { TBranch } from "@/types";
import { ControllerFactory } from "./factory-api-client";
import { transformBranchResponseToTBranch, transformBranchArrayToTBranchArray } from "./transform/branch";

/**
 * Helper to get an instance of BranchControllerApi with NextAuth using factory.
 */
async function getBranchController() {
  return await ControllerFactory.getBranchController();
}

/**
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
): Promise<TBranch[]> {
  try {
    const api = await getBranchController();
    const response = await api.fetchAllBranchesForAdmin({
      page,
      size,
      sort,
    });

    // Transform API response to TBranch format
    const branches = response.data?.result?.items || [];

    return transformBranchArrayToTBranchArray(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
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
    console.error("Error fetching branch:", error);
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
}): Promise<TBranch | null> {
  try {
    const api = await getBranchController();
    const response = await api.create9({
      branchRequest: {
        name: branchData.name,
        location: branchData.location,
        phone: branchData.phone,
      },
    });

    const branch = response.data?.result;
    if (!branch) return null;

    return transformBranchResponseToTBranch(branch);
  } catch (error) {
    console.error("Error creating branch:", error);
    return null;
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
): Promise<TBranch | null> {
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

    const branch = response.data?.result;
    if (!branch) return null;

    return transformBranchResponseToTBranch(branch);
  } catch (error) {
    console.error("Error updating branch:", error);
    return null;
  }
}

/**
 * Delete a branch
 */
export async function deleteBranchApi(id: number): Promise<boolean> {
  try {
    const api = await getBranchController();
    await api.delete11({
      id,
    });
    return true;
  } catch (error) {
    console.error("Error deleting branch:", error);
    return false;
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
    console.error("Error fetching active branches:", error);
    return [];
  }
}
