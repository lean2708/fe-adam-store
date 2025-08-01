"use client";

import { signIn } from "next-auth/react";
import { validateTokensAndPrepareLogin } from "@/actions/nextAuthActions";

/**
 * Client-side function to sign in with tokens and clean up cookies
 */
export async function signInWithTokens(
  accessToken: string,
  refreshToken?: string,
  cookiesToClear: string[] = []
) {
  try {
    // Step 1: Validate tokens on server and prepare login data
    const validationResult = await validateTokensAndPrepareLogin(
      accessToken,
      refreshToken,
      cookiesToClear
    );

    if (!validationResult.success || !validationResult.data) {
      return {
        success: false,
        error: validationResult.message || "Token validation failed"
      };
    }

    // Step 2: Use NextAuth client-side signIn with token-login provider
    const result = await signIn("token-login", {
      accessToken: validationResult.data.accessToken,
      refreshToken: validationResult.data.refreshToken || "",
      cookiesToClear: JSON.stringify(validationResult.data.cookiesToClear),
      redirect: false,
    });

    if (result?.ok && !result?.error) {
      // Note: Cookie cleanup will be handled by JWT callback
      return {
        success: true,
        error: null
      };
    } else {
      return {
        success: false,
        error: result?.error || "Login failed"
      };
    }
  } catch (error) {
    console.error("Token sign in error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during token sign in"
    };
  }
}
