// lib/data/auth.ts
// Import all necessary types and the AuthControllerApi from your auto-generated client
import {
    AuthControllerApi,
    type LoginRequest,
    type TokenResponse, // <-- Use TokenResponse explicitly here
    type RegisterRequest,
    type UserResponse,
} from '@/api-client';

// Import the Configuration class for initializing the API client
import { Configuration } from '@/api-client/configuration';

// Import your custom Axios helper for authenticated requests
import { getAuthenticatedAxiosInstance } from '@/lib/axios';

/**
 * Helper function to get an instance of AuthControllerApi.
 * (No change)
 */
function getAuthController(token?: string) {
    const config = new Configuration({
        basePath: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    });
    const instance = getAuthenticatedAxiosInstance(token);
    return new AuthControllerApi(config, undefined, instance);
}

/**
 * Authenticates a user by sending their credentials to the backend.
 * Now explicitly returns TokenResponse.
 *
 * @param credentials - An object containing the user's email and password.
 * @returns A Promise that resolves to the TokenResponse.
 * @throws {ApiErrorResponse} If the API call fails.
 */
export async function signInApi(credentials: LoginRequest): Promise<TokenResponse> { // <-- Explicitly return TokenResponse
    const authApi = getAuthController();

    const response = await authApi.login({ loginRequest: credentials });

    if (response.data.code !== 200) {
        throw response.data;
    }

    if (!response.data.result) {
        throw new Error('TokenResponse is missing in the response.');
    }
    return response.data.result; // <-- Now guaranteed to be TokenResponse
}

/**
 * Registers a new user with the provided details.
 * This function also includes an automatic sign-in after successful registration,
 * returning the TokenResponse from the login.
 *
 * @param data - An object containing the user's registration details.
 * @returns A Promise that resolves to the TokenResponse if registration and auto-login are successful.
 * @throws {ApiErrorResponse} If registration or the subsequent auto-login fails.
 */
export async function signUpApi(data: RegisterRequest): Promise<TokenResponse> { // <-- Explicitly return TokenResponse
    const authApi = getAuthController();

    const registerResponse = await authApi.register({ registerRequest: data });

    if (registerResponse.data.code !== 200) {
        throw registerResponse.data;
    }

    // If registration is successful, proceed with automatic login and return its TokenResponse.
    return signInApi({ email: data.email, password: data.password });
}

/**
 * Retrieves the currently authenticated user's information from the backend.
 * (No change)
 */
export async function getMyInfoApi(token: string): Promise<UserResponse> {
    const authApi = getAuthController(token);

    const response = await authApi.getMyInfo();

    if (response.data.code !== 200 || !response.data.result) {
        throw response.data;
    }

    return response.data.result;
}

/**
 * Logs out the user by invalidating their current access token on the backend.
 * (No change)
 */
export async function logoutApi(token: string): Promise<void> {
    const authApi = getAuthController(token);

    try {
        const requestFunction = await authApi.logout({ tokenRequest: { accessToken: token } });
    } catch (error: any) {
        console.warn("Logout API call failed, but clearing client tokens proceeds:", error.response?.data || error.message);
    }
}

/**
 * Refresh the access token using a refresh token.
 * @param refreshRequest - The refresh token request object.
 * @returns A Promise that resolves to TokenResponse.
 */
export async function refreshTokenApi(refreshRequest: { refreshToken: string }): Promise<TokenResponse> {
    const authApi = getAuthController();
    const response = await authApi.refreshToken({ refreshRequest });
    if (response.data.code !== 200 || !response.data.result) {
        throw response.data;
    }
    return response.data.result;
}