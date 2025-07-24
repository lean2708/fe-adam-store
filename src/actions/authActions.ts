// actions/authActions.ts
'use server';

import { deleteCookie, getCookie, setCookie } from '@/lib/cookies';
import { signInApi, signUpApi, getMyInfoApi, logoutApi } from '@/lib/data/auth';

import type { ActionResponse } from '@/lib/types/actions';
import type { UserResponse } from '@/api-client/models';
import { extractErrorMessage } from '@/lib/utils';

// Import schemas from new schema file
import { signInSchema, signUpSchema } from './schema/authSchema';

// --- Specific Return Type for getMeAction (no change) ---
interface GetMeResult extends ActionResponse<UserResponse> {
  isLogin: boolean;
}

// --- Server Actions ---

/**
 * Handles user sign-up.
 * Validates form data, calls the data layer for registration and auto-login,
 * sets authentication cookies, then fetches and returns full user data.
 */
export async function signUpAction(
  formData: FormData
): Promise<ActionResponse<UserResponse>> {
  const validatedFields = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // 1. Call the lib/data layer function for sign up and auto-login
    const tokenResponse = await signUpApi({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      name: validatedFields.data.name,
      confirmPassword: validatedFields.data.confirmPassword,
    });

    // 2. Set authentication cookies from the TokenResponse
    if (!tokenResponse?.accessToken || !tokenResponse?.refreshToken) {
      return {
        success: false,
        message:
          'Registration successful, but failed to obtain tokens for login.',
      };
    }

    setCookie('token', tokenResponse.accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    setCookie('refreshToken', tokenResponse.refreshToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // 3. IMPORTANT: Now fetch the full user profile using the *newly obtained* access token
    const user = await getMyInfoApi(tokenResponse.accessToken); // Call API directly

    return {
      success: true,
      message: 'Sign up and login successful!',
      data: user,
    }; // Return the full UserResponse
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'An unexpected error occurred during sign-up.'
    );
    console.error('Error in signUpAction:', extractedError);

    // Clean up cookies if getting user info failed after setting tokens
    deleteCookie('token');
    deleteCookie('refreshToken');

    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
      code: extractedError.code,
    };
  }
}

/**
 * Handles user sign-in.
 * Sets authentication cookies, then fetches and returns full user data.
 */
export async function signInAction(
  formData: FormData
): Promise<ActionResponse<UserResponse>> {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // 1. Call the lib/data layer function for sign-in
    const tokenResponse = await signInApi({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });

    // 2. Set authentication cookies from the TokenResponse
    if (!tokenResponse?.accessToken || !tokenResponse?.refreshToken) {
      return {
        success: false,
        message: 'Login failed: Failed to obtain tokens.',
      };
    }

    setCookie('token', tokenResponse.accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    setCookie('refreshToken', tokenResponse.refreshToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // 3. IMPORTANT: Now fetch the full user profile using the *newly obtained* access token
    const user = await getMyInfoApi(tokenResponse.accessToken); // Call API directly

    return { success: true, message: 'Login successful!', data: user }; // Return the full UserResponse
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'An unexpected error occurred during sign-in.'
    );
    console.error('Error in signInAction:', error);

    // Clean up cookies if getting user info failed after setting tokens
    deleteCookie('token');
    deleteCookie('refreshToken');

    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Retrieves the current authenticated user's information.
 * This is a standalone Server Action designed for consumption by Client/Server Components.
 * It will use the token already present in cookies.
 */
export async function getMeAction(): Promise<GetMeResult> {
  try {
    const token = await getCookie('token'); // Use await to ensure we get the cookie value

    if (!token) {
      return {
        isLogin: false,
        success: false,
        message: 'Not authenticated: No token found.',
        apiError: { code: 401, message: 'Authentication token not found.' },
      };
    }

    try {
      const user = await getMyInfoApi(token); // Call API directly
      return {
        isLogin: true,
        success: true,
        message: 'User info retrieved successfully.',
        data: user,
      };
    } catch (error) {
      const extractedError = extractErrorMessage(
        error,
        'Failed to retrieve user information from API.'
      );
      console.error('Error in getMeAction (API call):', error);

      // Invalidate tokens if the user is unauthorized/token is bad
      if (extractedError.code === 401 || extractedError.code === 403) {
        deleteCookie('token');
        deleteCookie('refreshToken');
      }

      return {
        isLogin: false,
        success: false,
        message: extractedError.message,
        apiError: extractedError,
      };
    }
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'An unexpected error occurred while checking user status.'
    );
    console.error('Unexpected error in getMeAction (top-level):', error);

    return {
      isLogin: false,
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Handles user logout.
 * (No functional change)
 */
export async function logoutAction(): Promise<ActionResponse> {
  try {
    const token = await getCookie('token');
    const refreshToken = await getCookie('refreshToken');
    if (!token && !refreshToken) {
      return { success: true, message: 'You are already logged out.' };
    }

    if (token) {
      await logoutApi(token);
    }

    deleteCookie('token');
    deleteCookie('refreshToken');

    return { success: true, message: 'Logged out successfully.' };
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'An unexpected server error occurred during logout.'
    );
    console.error('Error in logoutAction:', error);
    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}
