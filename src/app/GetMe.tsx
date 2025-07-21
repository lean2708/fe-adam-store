"use client";
import { getMeAction } from "@/actions/authActions";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";

// Spinner component that adapts to theme
const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
  </div>
);

export default function GetMe({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const signIn = useAuthStore((state) => state.signIn);

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await getMeAction();
        if (res.isLogin && res.data) {
          signIn(res.data);
        }
      } catch (error) {
        console.error("Failed to get user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getMe();
  }, [signIn]);

  if (isLoading) {
    return <Spinner />;
  }

  return <>{children}</>;
}