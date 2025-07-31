import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { Configuration } from "@/api-client/configuration";
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from "@/api-client/models/api-error-response";

// Create a base axios instance for API calls
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return instance;
};

// Global variables for token refresh management
let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Get NextAuth session and return access token
 */
export async function getNextAuthToken(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    return session?.accessToken || null;
  } catch (error) {
    console.error("Error getting NextAuth session:", error);
    return null;
  }
}

/**
 * Get NextAuth session
 */
export async function getNextAuthSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Error getting NextAuth session:", error);
    return null;
  }
}

/**
 * Create an authenticated axios instance with NextAuth token
 */
export async function getAuthenticatedAxiosInstance(): Promise<AxiosInstance> {
  const instance = createAxiosInstance();
  const token = await getNextAuthToken();

  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Add response interceptor for token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Check if it's a 401 error and not a refresh token retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const session = await getNextAuthSession();

            if (session?.refreshToken) {
              // Here you would implement token refresh logic
              // For now, we'll just reject since NextAuth handles token refresh differently
              console.warn("Token expired. User needs to re-authenticate.");
              processQueue(error);
              return Promise.reject(error);
            } else {
              processQueue(error);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            processQueue(refreshError);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // Queue the request while refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: () => resolve(instance(originalRequest)),
              reject
            });
          });
        }
      }

      // Handle other errors
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

  return instance;
}

/**
 * Get NextAuth-based Configuration for API clients
 */
export async function getNextAuthConfiguration(): Promise<Configuration> {
  const token = await getNextAuthToken();

  return new Configuration({
    baseOptions: token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } : {},
  });
}

/**
 * Get public Configuration (no auth) for API clients
 */
export function getPublicConfiguration(): Configuration {
  return new Configuration({});
}
