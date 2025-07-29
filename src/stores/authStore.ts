// stores/authStore.ts
"use client";

import { create } from "zustand";
// Assuming TUser is the same as UserResponse from your api-client/models
// You might want to explicitly import UserResponse here if TUser is a custom type.
import { EntityBasic, UserResponse } from '@/api-client/models'; // Make sure this matches your TUser
import { USER_ROLE } from "@/enums";

export type AuthState = {
  user: UserResponse | null; // Use UserResponse directly if TUser is equivalent
  isLogin: boolean;
  isRefreshing: boolean; // Optional: To indicate when a token refresh is in progress
};

export type AuthActions = {
  signIn: (user: UserResponse) => void; // Expect UserResponse directly
  logout: () => void;
  setRefreshing: (status: boolean) => void; // Optional action
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  user: null,
  isLogin: false,
  isRefreshing: false, // Initialize to false
  signIn: (user) => {
    set({
      user,
      isLogin: true,
      isRefreshing: false, // Ensure this is false after successful sign-in
    });
  },
  logout: () => set({ isLogin: false, user: null, isRefreshing: false }),
  setRefreshing: (status) => set({ isRefreshing: status }),
}));

// --- New: Selector for isAdmin ---
// This is a powerful way to derive state from your store without adding
// it directly to the `set` function, keeping your state lean.
export const selectIsAdmin = (state: AuthState) => {
  const roles = state.user?.roles; // Assuming UserResponse has a 'roles' property that matches TokenResponse's 'roles'
  // If UserResponse and TokenResponse roles differ, adjust here.
  // Your TokenResponse had `roles?: Set<EntityBasic>;`
  // So ensure UserResponse also has roles of that type.
  return Array.isArray(roles) && roles.some((role: EntityBasic) => role.name === USER_ROLE.ADMIN);
};

// You can also create a general purpose selector if you have many such checks
export const selectHasRole = (roleName: USER_ROLE) => (state: AuthState) => {
  const roles = state.user?.roles;
  return Array.isArray(roles) && roles.some((role: EntityBasic) => role.name === roleName);
};