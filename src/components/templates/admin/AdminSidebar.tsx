"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  FileImage,
  BarChart3,
  Settings,
  LogOut,
  MessageCircle,
  Ruler,
  Palette,
  Building,
  Tag
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const getSidebarItems = (t: any) => [
  {
    titleKey: "navigation.dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    titleKey: "navigation.users",
    href: "/admin/users",
    icon: Users,
  },
  {
    titleKey: "navigation.products",
    href: "/admin/products",
    icon: Package,
  },
  {
    titleKey: "navigation.orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    titleKey: "navigation.paymentHistory",
    href: "/admin/payment-history",
    icon: CreditCard,
  },
  {
    titleKey: "navigation.files",
    href: "/admin/files",
    icon: FileImage,
  },
  {
    titleKey: "navigation.chat",
    href: "/admin/chat",
    icon: MessageCircle,
  },
  {
    titleKey: "navigation.sizes",
    href: "/admin/sizes",
    icon: Ruler,
  },
  {
    titleKey: "navigation.colors",
    href: "/admin/colors",
    icon: Palette,
  },
  {
    titleKey: "navigation.branches",
    href: "/admin/branches",
    icon: Building,
  },
  {
    titleKey: "navigation.promotions",
    href: "/admin/promotions",
    icon: Tag,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const t = useTranslations("Admin");

  const sidebarItems = getSidebarItems(t);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold text-foreground">Adam Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{t(item.titleKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
