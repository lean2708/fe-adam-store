"use client";

import { useSession } from "next-auth/react";
import { useAuthStore } from "@/stores/authStore";
import { USER_ROLE } from "@/enums";
import type { UserResponse } from "@/api-client/models";

export function useAuth() {
  const { data: session, status } = useSession();
  const {
    signIn,
    logout,
    setRefreshing,
    isRefreshing,
    user,
    isLogin,
  } = useAuthStore();

  // Derived state
  const isLoading = status === "loading" || isRefreshing;
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Role checking functions
  const hasRole = (roleName: USER_ROLE): boolean => {
    const roles = session?.user?.roles || user?.roles;
    return Array.isArray(roles) && roles.some((role) => role.name === roleName);
  };

  const isAdmin = hasRole(USER_ROLE.ADMIN);

  // Enhanced sign in function
  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    return await signIn(email, password);
  };

  // Enhanced logout function
  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  return {
    // Session data
    session,
    user: session?.user || user,
    isAuthenticated,
    isLogin: isAuthenticated,
    isLoading,
    isRefreshing,
    
    // Actions
    signIn: handleSignIn,
    logout: handleLogout,
    setRefreshing,
    
    // Role checking
    hasRole,
    isAdmin,
    
    // Status
    status,
  };
}
