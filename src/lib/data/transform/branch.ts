import { ApiResponsePageResponseBranchResponse, BranchResponse } from "@/api-client";
import { ActionResponse } from "@/lib/types/actions";
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
    createdBy: apiBranch.createdBy ,
    updatedBy: apiBranch.updatedBy,
  };
}

/**
 * Transform array of BranchResponse to TBranch array
 */
export function transformBranchArrayToTBranchArray(apiBranches: BranchResponse[]): TBranch[] {
  return apiBranches.map(transformBranchResponseToTBranch);
}

export function transformApiResponsePageResponseSizeToActionResponse(
  apiResponse: ApiResponsePageResponseBranchResponse
): ActionResponse<TBranch[]> {

  return {
    success: true,
    message: "Sizes fetched successfully",
    actionSizeResponse: {
      size: apiResponse.result?.size ?? 0,
      totalPages: apiResponse.result?.totalPages ?? 0,
      totalItems: apiResponse.result?.totalItems ?? 0
    },
    data: (apiResponse.result?.items ?? []).map(transformBranchResponseToTBranch)
  };
}
