"use client";

import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "@/components/modules/ThemeToggle";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on a product detail page
  const isProductDetailPage =
    pathname?.includes("/admin/products/") && pathname?.split("/").length > 4;

  return (
    <header className="h-16 bg-slate-700 border-b border-slate-600 flex items-center justify-between px-6 sticky top-0 z-10 rounded-tl-2xl">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative flex-1">
          {isProductDetailPage && (
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Right side - User info */}
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <User className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-medium">{user?.name}</span>
      </div>
    </header>
  );
}
