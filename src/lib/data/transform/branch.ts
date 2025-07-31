import { BranchResponse } from "@/api-client";
import { TBranch } from "@/types";

/**
 * Transform API BranchResponse to TBranch
 */
export function transformBranchResponseToTBranch(apiBranch: BranchResponse): TBranch {
  return {
    id: apiBranch.id?.toString() || '',
    name: apiBranch.name || '',
    location: apiBranch.location || '',
    phone: apiBranch.phone || '',
    status: (apiBranch.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
    createdAt: apiBranch.createdAt,
    updatedAt: apiBranch.updatedAt,
  };
}

/**
 * Transform array of BranchResponse to TBranch array
 */
export function transformBranchArrayToTBranchArray(apiBranches: BranchResponse[]): TBranch[] {
  return apiBranches.map(transformBranchResponseToTBranch);
}
