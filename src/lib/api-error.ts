import { ApiErrorResponse } from "@/api-client/models/api-error-response";

/**
 * Extracts a user-friendly error message from an error object.
 */
export function extractErrorMessage(error: any, fallback: string = "An error occurred"): ApiErrorResponse {
    let message = fallback;
    let code: number | undefined = undefined;

    if (error && typeof error === "object") {
        if ("response" in error && error.response?.data?.message) {
            message = error.response.data.message;
            code = error.response?.data?.code;
        } else if ("message" in error && typeof error.message === "string") {
            message = error.message;
        }
    }

    // return simplified error only (no circular reference)
    return { message, code };
}
