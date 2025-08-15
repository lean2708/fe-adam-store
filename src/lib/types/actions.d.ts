// lib/types/actions.d.ts
import { ApiErrorResponse } from "@/api-client/models/api-error-response";

export interface ActionResponse<T = undefined> {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>; // For Zod validation errors
    data?: T; // For successful data return
    apiError?: ApiErrorResponse; // For raw API error details
    code?: number; // Optional error code
    actionSizeResponse?: ActionSizeResponse;
}
export interface ActionSizeResponse {
    size: number;
    totalPages: number;
    totalItems: number; // For Zod validation errors
}