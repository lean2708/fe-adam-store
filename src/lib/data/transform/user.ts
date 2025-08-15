import type { UserResponse, ApiResponsePageResponseUserResponse } from "@/api-client/models";
import type { TUser } from "@/types";
import { ActionResponse } from "@/lib/types/actions";

/**
 * Transform API UserResponse to TUser.
 */
export function transformUserResponseToTUser(apiUser: UserResponse): TUser {
    return {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        status: apiUser.status as 'ACTIVE' | 'INACTIVE',
        avatarUrl: apiUser.avatarUrl,
        dob: apiUser.dob,
        gender: apiUser.gender as 'FEMALE' | 'MALE' | 'OTHER',
        createdBy: apiUser.createdBy,
        updatedBy: apiUser.updatedBy,
        createdAt: apiUser.createdAt,
        updatedAt: apiUser.updatedAt,
        roles: apiUser.roles
    };
}

/**
 * Transform array of UserResponse to TUser array
 */
export function transformUserArrayToTUserArray(apiUsers: UserResponse[]): TUser[] {
    return apiUsers.map(transformUserResponseToTUser);
}

/**
 * Transform API response page response to ActionResponse for users
 */
export function transformApiResponsePageResponseUserToActionResponse(
    apiResponse: ApiResponsePageResponseUserResponse
): ActionResponse<TUser[]> {
    return {
        success: true,
        message: "Users fetched successfully",
        actionSizeResponse: {
            size: apiResponse.result?.size ?? 0,
            totalPages: apiResponse.result?.totalPages ?? 0,
            totalItems: apiResponse.result?.totalItems ?? 0
        },
        data: (apiResponse.result?.items ?? []).map(transformUserResponseToTUser)
    };
}
