// lib/data/auth.ts
// Import all necessary types and the AuthControllerApi from your auto-generated client
import {
  AuthControllerApi,
  type LoginRequest,
  type TokenResponse, // <-- Use TokenResponse explicitly here
  type RegisterRequest,
  type UserResponse,
  VerifyCodeRequest,
  VerificationCodeResponse,
  RedisForgotPasswordToken,
  ResetPasswordRequest,
} from '@/api-client';

import { getAuthenticatedAxiosInstance, getPublicAxiosInstance, getNextAuthSession } from '@/lib/auth/axios-config';

/**
 * Helper function to get an instance of AuthControllerApi with NextAuth.
 */
async function getAuthController(token?: string) {
  if (token) {
    // Use provided token (for specific operations like logout)
    const instance = getPublicAxiosInstance();
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return new AuthControllerApi(undefined, undefined, instance);
  } else {
    // Use NextAuth session token
    const instance = await getAuthenticatedAxiosInstance();
    return new AuthControllerApi(undefined, undefined, instance);
  }
}

/**
 * Helper function to get a public instance of AuthControllerApi (no auth).
 */
function getPublicAuthController() {
  const instance = getPublicAxiosInstance();
  return new AuthControllerApi(undefined, undefined, instance);
}


/**
 * Authenticates a user by sending their credentials to the backend.
 * Now explicitly returns TokenResponse.
 *
 * @param credentials - An object containing the user's email and password.
 * @returns A Promise that resolves to the TokenResponse.
 * @throws {ApiErrorResponse} If the API call fails.
 */
export async function signInApi(
  credentials: LoginRequest
): Promise<TokenResponse> {
  // <-- Explicitly return TokenResponse
  const authApi = getPublicAuthController(); // Use public controller for login

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
 * returning the TokenResponse from the login.
 *
 * @param data - An object containing the user's registration details.
 * @returns A Promise that resolves to the TokenResponse if registration and auto-login are successful.
 * @throws {ApiErrorResponse} If registration or the subsequent auto-login fails.
 */
export async function signUpApi(
  data: RegisterRequest
): Promise<VerificationCodeResponse> {
  // <-- Explicitly return TokenResponse
  const authApi = getPublicAuthController(); // Use public controller for registration

  const registerResponse = await authApi.register({ registerRequest: data });

  if (
    registerResponse.data.code !== 200 &&
    registerResponse.data.code !== 201
  ) {
    throw registerResponse.data;
  }

  if (!registerResponse.data.result) {
    throw new Error('TokenResponse is missing in the response.');
  }

  // If registration is successful, proceed with automatic login and return its TokenResponse.
  return registerResponse.data.result;
}

/**
 * User sends email to request confirmation verification code
 * returning the forgotPasswordToken
 *
 * @param request - An email that the user previously registered with.
 * @returns A Promise that resolves to the TokenResponse if registration and auto-login are successful.
 * @throws {ApiErrorResponse} If registration or the subsequent auto-login fails.
 */
export async function forgotPasswordApi(request: {
  email: string;
}): Promise<VerificationCodeResponse> {
  const authApi = getPublicAuthController(); // Use public controller for forgot password
  const response = await authApi.forgotPassword({
    emailRequest: request,
  });
  if (response.data.code !== 200 && response.data.code !== 201) {
    throw response.data;
  }

  if (!response.data.result) {
    throw new Error('TokenResponse is missing in the response.');
  }
  return response.data.result;
}

export async function verifyForgotPasswordCodeApi(
  request: VerifyCodeRequest
): Promise<RedisForgotPasswordToken> {
  const authApi = getPublicAuthController(); // Use public controller for verification
  const response = await authApi.verifyForgotPasswordCode({
    verifyCodeRequest: request,
  });

  if (response.data.code !== 200 && response.data.code !== 201) {
    throw response.data;
  }

  if (!response.data.result) {
    throw new Error('TokenResponse is missing in the response.');
  }
  return response.data.result;
}

export async function resetPasswordApi(
  request: ResetPasswordRequest
): Promise<void> {
  const authApi = getPublicAuthController(); // Use public controller for password reset
  const response = await authApi.resetPassword({
    resetPasswordRequest: request,
  });

  if (response.data.code !== 200 && response.data.code !== 201) {
    throw response.data;
  }
}

/**
 * Retrieves the currently authenticated user's information from the backend.
 * Gets access token from NextAuth session automatically.
 */
export async function getMyInfoApi(token?: string): Promise<UserResponse> {
  let accessToken = token;

  // If no token provided, get it from NextAuth session
  if (!accessToken) {
    const session = await getNextAuthSession();
    accessToken = session?.accessToken;
  }

  if (!accessToken) {
    throw new Error('No access token available for getMyInfo');
  }

  const authApi = await getAuthController(accessToken);

  const response = await authApi.getMyInfo();

  if (response.data.code !== 200 || !response.data.result) {
    throw response.data;
  }

  return response.data.result;
}

/**
 * Xác thực đăng ký tài khoản bằng mã OTP
 * @param request - Dữ liệu xác thực gồm email và mã OTP
 * @returns TokenResponse nếu thành công
 */
export async function verifyRegistrationApi(
  request: VerifyCodeRequest
): Promise<TokenResponse> {
  const authApi = getPublicAuthController(); // Use public controller for verification

  const response = await authApi.verifyCodeAndRegister({
    verifyCodeRequest: request,
  });

  if (response.data.code !== 200 && response.data.code !== 201) {
    throw response.data;
  }

  if (!response.data.result) {
    throw new Error('TokenResponse is missing in the response.');
  }

  return response.data.result;
}

/**
 * Logs out the user by invalidating their current access token on the backend.
 * (No change)
 */
export async function logoutApi(): Promise<void> {
  // Get the access token from NextAuth session
  const session = await getNextAuthSession();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    console.warn('No access token found in session for logout');
    return;
  }

  const authApi = await getAuthController();

  try {
    await authApi.logout({
      tokenRequest: { accessToken },
    });
  } catch (error: any) {
    console.warn(
      'Logout API call failed, but clearing client tokens proceeds:',
      error.response?.data || error.message
    );
  }
}

/**
 * Refresh the access token using a refresh token.
 * @param refreshRequest - The refresh token request object.
 * @returns A Promise that resolves to TokenResponse.
 */
export async function refreshTokenApi(refreshRequest: {
  refreshToken: string;
}): Promise<TokenResponse> {
  const authApi = getPublicAuthController(); // Use public controller for token refresh
  const response = await authApi.refreshToken({ refreshRequest });
  if (response.data.code !== 200 || !response.data.result) {
    throw response.data;
  }
  return response.data.result;
}
