// lib/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from "@/api-client/models/api-error-response"; // Adjust the import path as needed

// Import cookies from next/headers. IMPORTANT: This can only be imported/used
// in Server Components/Actions. Thus, this interceptor logic MUST be separate
// if you have a client-side axios instance. For our setup, all data calls go through
// server actions, so it's okay here, but be mindful of client-side Axios instances.
// For simplicity in this combined file, let's assume this is only for server-side Axios.
// If you use Axios directly in client components for other API calls, you'd need a separate
// client-side Axios instance without cookie management here.

// For a server-side only Axios instance:

// Import the new refresh function from lib/data/auth
import { refreshTokenApi } from '@/lib/data/auth';
import { deleteCookie, getCookie, setCookie } from './cookies';

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any | null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(); // If successful, retry with new token (handled by retrying original request)
        }
    });
    failedQueue = [];
};


// 1. Base Axios Client Instance (no change here from previous version)
const baseApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 2. Response Interceptor for Global Error Handling AND Token Refresh
baseApiClient.interceptors.response.use(
    (response) => response, // Successfully responses just pass through
    async (error: AxiosError<ApiErrorResponse>) => { // Explicitly type error
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Check if it's a 401 error and not a refresh token retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as retried to prevent infinite loops

            // Only attempt to refresh if we aren't already refreshing
            if (!isRefreshing) {
                isRefreshing = true; // Set flag to indicate refresh in progress

                // This is a server-side interceptor, so we can access cookies directly
                const refreshToken = await getCookie('refreshToken');

                if (refreshToken) {
                    try {
                        // Call the refresh API (server-side operation)
                        const refreshResponse = await refreshTokenApi({ refreshToken });

                        // Update cookies with new access and refresh tokens
                        if (refreshResponse?.accessToken) {
                            setCookie("token", refreshResponse.accessToken, { httpOnly: true, path: "/", secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
                        }
                        if (refreshResponse?.refreshToken) {
                            setCookie("refreshToken", refreshResponse.refreshToken, { httpOnly: true, path: "/", secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
                        }

                        // Update the original request's authorization header with the new token
                        if (refreshResponse?.accessToken) {
                            originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
                        }

                        // Process the queue of failed requests (retry them)
                        processQueue(null);

                        // Retry the original failed request with the new token
                        return baseApiClient(originalRequest);

                    } catch (refreshError: any) {
                        console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);
                        // If refresh fails, clear all tokens and reject all queued requests
                        deleteCookie("token");
                        deleteCookie("refreshToken");
                        processQueue(refreshError.response?.data || refreshError); // Reject with refresh error
                        return Promise.reject(refreshError.response?.data || refreshError); // Reject the original request with refresh error
                    } finally {
                        isRefreshing = false; // Reset refreshing flag
                    }
                } else {
                    // No refresh token, or refresh token invalid/expired.
                    // Clear any potentially stale access tokens and redirect to login.
                    deleteCookie("token");
                    deleteCookie("refreshToken");
                    // On server-side, you might want to redirect explicitly or return error.
                    // For an interceptor, just reject and let the calling action handle.
                    processQueue(error); // Reject all queued requests with original 401 error
                    return Promise.reject(error);
                }
            } else {
                // Refresh token is already being obtained, so queue the original request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve: () => resolve(baseApiClient(originalRequest)), reject });
                });
            }
        }

        // For any other errors (non-401, or 401 after retry/no refresh token flow)
        if (axios.isAxiosError(error) && error.response) {
            const apiError = error.response.data as ApiErrorResponse;
            console.error(
                `API Error [${error.response.status}]:`,
                apiError.message || error.message,
                error.response.data
            );
            return Promise.reject(apiError);
        } else if (axios.isAxiosError(error)) {
            console.error('Network Error:', error.message);
            return Promise.reject(new Error(`Network Error: ${error.message}`));
        } else {
            console.error('An unknown error occurred:', error);
            return Promise.reject(new Error('An unknown error occurred.'));
        }
    }
);

// 3. Helper Function: `getAuthenticatedAxiosInstance` (no change from previous)
export function getAuthenticatedAxiosInstance(token?: string) {
    const instance = baseApiClient.create();
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return instance;
}

// 4. Export the base instance
export default baseApiClient;