"use client";

import { Link } from "@/i18n/routing";
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
  LogOut,
  MessageCircle,
  Ruler,
  Palette,
  Building,
  Tag,
  FolderTree,
  Search
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const getSidebarItems = () => [
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
    titleKey: "navigation.branches",
    href: "/admin/branches",
    icon: Building,
  },
  {
    titleKey: "navigation.categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    titleKey: "navigation.products",
    href: "/admin/products",
    icon: Package,
  },
  {
    titleKey: "navigation.colors",
    href: "/admin/colors",
    icon: Palette,
  },
  {
    titleKey: "navigation.sizes",
    href: "/admin/sizes",
    icon: Ruler,
  },
  {
    titleKey: "navigation.promotions",
    href: "/admin/promotions",
    icon: Tag,
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
    titleKey: "navigation.chat",
    href: "/admin/chat",
    icon: MessageCircle,
  },
  {
    titleKey: "navigation.files",
    href: "/admin/files",
    icon: FileImage,
  },
  {
    titleKey: "navigation.search",
    href: "/admin/search",
    icon: Search,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const t = useTranslations("Admin");

  const sidebarItems = getSidebarItems();

  // Helper function to check if a path is active
  const isPathActive = (itemHref: string) => {
    // Remove locale prefix from pathname for comparison (e.g., /en/admin/users -> /admin/users)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

    // Exact match for dashboard
    if (itemHref === "/admin") {
      return pathWithoutLocale === "/admin" || pathWithoutLocale === "/";
    }

    // For other paths, check if current path starts with the item path
    // Also ensure we don't match partial segments (e.g., /admin/user shouldn't match /admin/users)
    if (pathWithoutLocale.startsWith(itemHref)) {
      const remainingPath = pathWithoutLocale.slice(itemHref.length);
      return remainingPath === '' || remainingPath.startsWith('/');
    }

    return false;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-64 bg-card  h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold text-foreground">Adam Store</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto border-r border-border">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = isPathActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm border-l-4 border-primary-foreground/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary-foreground")} />
              <span className={cn(isActive && "font-semibold")}>{t(item.titleKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t  flex-shrink-0 border-r border-border">
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
