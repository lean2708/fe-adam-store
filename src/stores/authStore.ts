// stores/authStore.ts
"use client";

import { create } from "zustand";
import { EntityBasic, UserResponse } from '@/api-client/models';
import { USER_ROLE } from "@/enums";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

export type AuthState = {
  user: UserResponse | null;
  isLogin: boolean;
  isRefreshing: boolean;
  session: Session | null;
};

export type AuthActions = {
  signIn: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setRefreshing: (status: boolean) => void;
  setSession: (session: Session | null) => void;
  syncWithNextAuth: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  user: null,
  isLogin: false,
  isRefreshing: false,
  session: null,

  signIn: async (email: string, password: string): Promise<boolean> => {
    try {
      set({ isRefreshing: true });

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok && !result?.error) {
        // NextAuth will handle the session, we'll sync it via setSession
        return true;
      }

      set({ isRefreshing: false });
      return false;
    } catch (error) {
      console.error("Sign in error:", error);
      set({ isRefreshing: false });
      return false;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut({ redirect: false });
      set({
        isLogin: false,
        user: null,
        isRefreshing: false,
        session: null
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if signOut fails
      set({
        isLogin: false,
        user: null,
        isRefreshing: false,
        session: null
      });
    }
  },

  setRefreshing: (status: boolean) => set({ isRefreshing: status }),

  setSession: (session: Session | null) => {
    set({
      session,
      user: session?.user || null,
      isLogin: !!session?.user,
      isRefreshing: false,
    });
  },

  syncWithNextAuth: () => {
    // This will be called from a component that has access to useSession
    // The actual syncing will be done via setSession
  },
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