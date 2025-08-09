import { getServerSession } from "next-auth/next";
import { authOptions } from "./config";
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from "@/api-client/models/api-error-response";

// Global variables for token refresh management
let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void; }[] = [];

const processQueue = (error: unknown | null) => {
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
 * Kick user out by clearing cookies and redirecting to login
 */
const kickUserOut = async (reason: string) => {
  try {
    console.warn('Kicking user out:', reason);

    // Clear all auth cookies
    const cookiesToClear = [
      'refresh_token',
      'pending_email',
      'forgot_password_email',
      'forgot_password_token'
    ];

    // Clear cookies on client side if available
    if (typeof window !== 'undefined') {
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=lax`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      });
    }

    // Import signOut dynamically to avoid circular dependencies
    if (typeof window !== 'undefined') {
      const { signOut } = await import("next-auth/react");
      await signOut({
        redirect: true,
        callbackUrl: '/login?message=session_expired'
      });
    }
  } catch (error) {
    console.error('Error kicking user out:', error);
    // Fallback: redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login?message=session_expired';
    }
  }
};

/**
 * Create a base axios instance for API calls
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return instance;
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
 * Create an authenticated axios instance with NextAuth token and refresh logic
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
            // Import getCookie dynamically to avoid circular dependency
            const { getCookie, setCookie } = await import("@/lib/cookies");
            const refreshToken = await getCookie('refresh_token');

            if (refreshToken) {
              // Import refreshTokenApi dynamically to avoid circular dependency
              const { refreshTokenApi } = await import("@/lib/data/auth");

              // Attempt to refresh the token
              const newTokens = await refreshTokenApi({
                refreshToken: refreshToken
              });

              if (newTokens?.accessToken) {
                // Update the authorization header for future requests
                instance.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;

                // Update refresh token in httpOnly cookie if new one provided
                if (newTokens.refreshToken) {
                  await setCookie('refresh_token', newTokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60, // 7 days
                    path: '/',
                  });
                }

                // Process queued requests
                processQueue(null);

                // Retry the original request
                return instance(originalRequest);
              } else {
                throw new Error("Failed to refresh token");
              }
            } else {
              // No refresh token available, kick user out
              await kickUserOut("No refresh token available");
              throw new Error("No refresh token available");
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            processQueue(refreshError);

            // Kick user out on refresh failure
            await kickUserOut("Token refresh failed");
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
 * Create a public axios instance (no authentication)
 */
export function getPublicAxiosInstance(): AxiosInstance {
  return createAxiosInstance();
}
