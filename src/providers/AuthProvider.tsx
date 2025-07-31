"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

// Component to sync NextAuth session with Zustand store
function AuthSync() {
  const { data: session, status } = useSession();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    if (status !== "loading") {
      setSession(session);
    }
  }, [session, status, setSession]);

  return null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}
