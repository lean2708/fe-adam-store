import type { UserResponse, ApiResponsePageResponseUserResponse } from "@/api-client/models";
import { ActionResponse } from "@/lib/types/actions";

/**
 * Transform API UserResponse to UserResponse (no transformation needed for now).
 */
export function transformUserResponseToUserResponse(apiUser: UserResponse): UserResponse {
    return apiUser;
}

/**
 * Transform array of UserResponse to UserResponse array
 */
export function transformUserArrayToUserArray(apiUsers: UserResponse[]): UserResponse[] {
    return apiUsers.map(transformUserResponseToUserResponse);
}

/**
 * Transform API response page response to ActionResponse for users
 */
export function transformApiResponsePageResponseUserToActionResponse(
    apiResponse: ApiResponsePageResponseUserResponse
): ActionResponse<UserResponse[]> {
    return {
        success: true,
        message: "Users fetched successfully",
        actionSizeResponse: {
            size: apiResponse.result?.size ?? 0,
            totalPages: apiResponse.result?.totalPages ?? 0,
            totalItems: apiResponse.result?.totalItems ?? 0
        },
        data: (apiResponse.result?.items ?? []).map(transformUserResponseToUserResponse)
    };
}
