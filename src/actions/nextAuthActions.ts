"use server";

import { signIn, signOut } from "next-auth/react";
import { 
  signUpApi, 
  verifyRegistrationApi, 
  forgotPasswordApi,
  verifyForgotPasswordCodeApi,
  resetPasswordApi 
} from "@/lib/data/auth";
import { setCookie, getCookie, deleteCookie } from "@/lib/cookies";
import type { ActionResponse } from "@/lib/types/actions";
import type { 
  UserResponse, 
  VerificationCodeResponse, 
  RedisForgotPasswordToken 
} from "@/api-client/models";
import { extractErrorMessage } from "@/lib/utils";
import {
  signUpSchema,
  verifyRegistrationSchema,
  forgotPasswordSchema,
  verifyForgotPasswordSchema,
  resetPasswordSchema,
} from "./schema/authSchema";

/**
 * Server action for user registration
 * This doesn't use NextAuth since registration is a separate flow
 */
export async function signUpAction(
  formData: FormData
): Promise<ActionResponse<{ email: string }>> {
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
    const tokenResponse = await signUpApi({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      name: validatedFields.data.name,
      confirmPassword: validatedFields.data.confirmPassword,
    });

    if (!tokenResponse?.verificationCode) {
      return {
        success: false,
        message: 'Registration successful, but failed to obtain verification code for verify.',
      };
    }

    await setCookie('pending_email', validatedFields.data.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes
      path: '/register/verify',
    });

    return {
      success: true,
      message: 'Mã xác thực đã được gửi đến email của bạn',
      data: { email: validatedFields.data.email },
    };
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'An unexpected error occurred during sign-up.'
    );
    console.error('Error in signUpAction:', extractedError);

    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
      code: extractedError.code,
    };
  }
}

/**
 * Verify registration and automatically sign in with NextAuth
 */
export async function verifyRegistrationAction(
  email: string,
  formData: FormData
): Promise<ActionResponse<UserResponse>> {
  const validatedFields = verifyRegistrationSchema.safeParse({
    verifyCodeRequest: formData.get('verifyCodeRequest'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const tokenResponse = await verifyRegistrationApi({
      email,
      verificationCode: validatedFields.data.verifyCodeRequest,
    });

    if (!tokenResponse?.accessToken || !tokenResponse?.refreshToken) {
      return {
        success: false,
        message: 'Verification successful, but failed to obtain tokens for login.',
      };
    }

    // Clean up the pending email cookie
    await deleteCookie('pending_email');

    return {
      success: true,
      message: 'Xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.',
      data: { email } as any, // User should sign in manually after verification
    };
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'An unexpected error occurred during verification.'
    );
    console.error('Error in verifyRegistrationAction:', extractedError);

    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
      code: extractedError.code,
    };
  }
}

/**
 * Forgot password action
 */
export async function forgotPasswordAction(
  formData: FormData
): Promise<ActionResponse<VerificationCodeResponse>> {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const verificationCodeResponse = await forgotPasswordApi({
      email: validatedFields.data.email,
    });

    if (!verificationCodeResponse.email) {
      return {
        success: false,
        message: 'Send email code failed: Failed to obtain code.',
      };
    }

    await setCookie('forgot_password_email', verificationCodeResponse.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes
      path: '/forgot_password/verify_code',
    });

    return {
      success: true,
      message: 'Mã xác thực đã được gửi đến email của bạn',
      data: verificationCodeResponse,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'Failed to send verification code.'
    );
    console.error('Error in forgotPasswordAction:', error);

    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Verify forgot password code action
 */
export async function verifyForgotPasswordCodeAction(
  formData: FormData
): Promise<ActionResponse<RedisForgotPasswordToken>> {
  const validatedFields = verifyForgotPasswordSchema.safeParse({
    verificationCode: formData.get('verificationCode'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const email = await getCookie('forgot_password_email');

  if (!email) {
    return {
      success: false,
      message: 'Không tìm thấy email. Vui lòng thử lại',
    };
  }

  try {
    const verifyForgotPasswordCodeResponse = await verifyForgotPasswordCodeApi({
      email,
      verificationCode: validatedFields.data.verificationCode,
    });

    if (
      !verifyForgotPasswordCodeResponse?.forgotPasswordToken ||
      !verifyForgotPasswordCodeResponse.email
    ) {
      return {
        success: false,
        message: 'Send verification code failed: Failed to obtain code.',
      };
    }

    await setCookie(
      'forgot_password_token',
      verifyForgotPasswordCodeResponse.forgotPasswordToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 300, // 5 minutes
        path: '/forgot_password/reset_password',
      }
    );

    return {
      success: true,
      message: 'Xác thực thành công',
      data: verifyForgotPasswordCodeResponse,
    };
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'Failed to verify code.'
    );
    console.error('Error in verifyForgotPasswordCodeAction:', error);

    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
    };
  }
}

/**
 * Reset password action
 */
export async function resetPasswordAction(
  formData: FormData
): Promise<ActionResponse> {
  const validatedFields = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const token = await getCookie('forgot_password_token');

  if (!token) {
    return {
      success: false,
      message: 'Token không hợp lệ. Vui lòng thử lại',
    };
  }

  try {
    await resetPasswordApi({
      forgotPasswordToken: token,
      newPassword: validatedFields.data.password,
      confirmPassword: validatedFields.data.confirmPassword,
    });

    // Clean up cookies after successful reset
    await deleteCookie('forgot_password_token');
    await deleteCookie('forgot_password_email');

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    };
  } catch (error) {
    const extractedError = extractErrorMessage(
      error,
      'An unexpected error occurred during reset password.'
    );
    console.error('Error in resetPasswordAction:', extractedError);

    // Clean up cookies on error
    await deleteCookie('forgot_password_token');
    await deleteCookie('forgot_password_email');

    return {
      success: false,
      message: extractedError.message,
      apiError: extractedError,
      code: extractedError.code,
    };
  }
}

/**
 * Get pending email for verification
 */
export async function handlePendingEmail(): Promise<string | null> {
  try {
    const email = await getCookie('pending_email');
    return email || null;
  } catch (error) {
    console.error('Error handling pending email:', error);
    return null;
  }
}
