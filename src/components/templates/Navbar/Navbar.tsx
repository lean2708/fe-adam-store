"use client";

import { useState, useCallback, useMemo } from "react";
import { ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import modals from modal folder
import UserModal from "./modal/UserModal";
import CartModal from "./modal/CartModal/CartModal";
import MobileSidebar from "./modal/MobileSidebar";
import ThemeToggle from "@/components/modules/ThemeToggle";
import Logo from "@/components/modules/Logo";
import SearchComponent from "./components/SearchComponent";
import NavigationLocaleSwitcherPublic from "./components/NavigationLocaleSwitcherPublic";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  const cartItems = useCartStore((state) => state.cartItems);
  // Only manage modal open/close triggers here
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  // Modal close handlers
  const handleCartModalClose = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const handleUserModalClose = useCallback(() => {
    setIsUserModalOpen(false);
  }, []);

  const handleMobileSidebarClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle search expansion from SearchComponent
  const handleSearchExpand = useCallback((expanded: boolean) => {
    setIsSearchExpanded(expanded);
  }, []);
  return (
    <header className="border-b adam-store-border adam-store-bg relative h-16 flex items-center">
      {/* Hide other content when search is expanded */}
      <>
        {/* Mobile Menu Button */}
        <div className="absolute left-5 top-0 h-16 flex items-center z-50 pl-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {/* `Logo */}`{/* Centered Logo - Hidden on mobile */}
        <div className="hidden sm:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <Logo />
        </div>
        {/* Right Side Icons */}
        {/* Search Component */}
        <SearchComponent onSearchExpand={handleSearchExpand} />
        <div className="absolute right-5 top-0 h-16 flex items-center z-20">
          <div className="flex items-center space-x-4">
            {/* User and Cart Icons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserModalOpen((v) => !v)}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </>
      <div className="px-15">
        <div className=" items-center justify-start">
          <NavigationLocaleSwitcherPublic />
        </div>
      </div>

      {/* Modals */}
      {isUserModalOpen && (
        <div className=" absolute right-5 top-8 ">
          <UserModal open={isUserModalOpen} onClose={handleUserModalClose} />
        </div>
      )}

      {isCartOpen && (
        <div className=" absolute right-5 top-2 ">
          <CartModal
            userId={user?.id || 0}
            open={isCartOpen}
            onClose={handleCartModalClose}
          />
        </div>
      )}
      {isMobileMenuOpen && (
        <MobileSidebar
          open={isMobileMenuOpen}
          onClose={handleMobileSidebarClose}
        />
      )}
    </header>
  );
}
