"use client";

import { useAuth } from "@/hooks/useAuth";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminHeader() {
  const { user, logout } = useAuth();


  return (
    <header className="h-16 bg-slate-700 border-b border-slate-600 flex items-center justify-between px-6 sticky top-0 z-10 rounded-tl-2xl">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative flex-1">
          {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-10 bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 focus:border-slate-400"
          /> */}
        </div>
      </div>

      {/* Right side - User info */}
      <div className="flex items-center space-x-3">
        <User className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-medium">{user?.name}</span>
      </div>
    </header>
  );
}
