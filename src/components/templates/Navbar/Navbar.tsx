'use client';

import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { ShoppingBag, User, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/modules/ThemeToggle';
import Logo from '@/components/modules/Logo';
import SearchComponent from './components/SearchComponent';
import NavigationLocaleSwitcherPublic from './components/NavigationLocaleSwitcherPublic';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
import {
  CartModalWithoutLoginSkeleton,
  UserModalSkeleton,
} from '@/components/ui/skeleton';

// *Dynamic modals
const UserModal = dynamic(() => import('./modal/UserModal'), {
  loading: () => <UserModalSkeleton />,
  ssr: false,
});
const CartModal = dynamic(() => import('./modal/CartModal/CartModal'), {
  loading: () => <CartModalWithoutLoginSkeleton />,
  ssr: false,
});
const MobileSidebar = dynamic(() => import('./modal/MobileSidebar'), {
  ssr: false,
});

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  // State quản lý việc mở/đóng modal
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Các hàm đóng modal được bọc trong useCallback
  const handleCartModalClose = useCallback(() => setIsCartOpen(false), []);
  const handleUserModalClose = useCallback(() => setIsUserModalOpen(false), []);
  const handleMobileSidebarClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle search expansion from SearchComponent
  const handleSearchExpand = useCallback((expanded: boolean) => {
    setIsSearchExpanded(expanded);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      clearCart();
    }
  }, [isAuthenticated, clearCart]);

  return (
    <header className='border-b adam-store-border adam-store-bg relative h-16 flex items-center'>
      <>
        {/* Mobile Menu Button */}
        <div className='absolute left-5 top-0 h-16 flex items-center z-50 pl-2'>
          <Button
            variant='ghost'
            aria-label='Mobile Menu'
            size='sm'
            onClick={() => setIsMobileMenuOpen(true)} // Chỉ mở, không toggle
          >
            <Menu className='h-5 w-5' />
          </Button>
        </div>
        {/* Centered Logo */}
        <div className='hidden sm:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
          <Logo />
        </div>

        {/* Right Side Icons */}
        {/* Search Component */}
        <SearchComponent onSearchExpand={handleSearchExpand} />
        <div className='absolute right-5 top-0 h-16 flex items-center z-20'>
          <div className='flex items-center space-x-4'>
            {/* User and Cart Icons */}
            <div className='flex items-center space-x-2'>
              <Button
                variant='ghost'
                aria-label='User Menu'
                size='sm'
                onClick={() => setIsUserModalOpen(true)}
              >
                <User className='h-5 w-5' />
              </Button>
              <Button
                variant='ghost'
                aria-label='Cart'
                size='sm'
                onClick={() => setIsCartOpen(true)}
                className='relative'
              >
                <ShoppingBag className='h-5 w-5' />
                {cartItems.length > 0 && isAuthenticated && (
                  <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {cartItems.length}
                  </span>
                )}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </>
      {/* Language Switcher  */}
      <div className='absolute left-20 top-0 h-16 flex items-center z-10'>
        <NavigationLocaleSwitcherPublic />
      </div>

      {/* Sử dụng Suspense để bao bọc các modal được tải động */}
      <Suspense fallback={null}>
        {isUserModalOpen && (
          <div className='absolute right-5 top-8'>
            <UserModal open={isUserModalOpen} onClose={handleUserModalClose} />
          </div>
        )}
        {isCartOpen && (
          <div className='absolute right-5 top-2'>
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
      </Suspense>
    </header>
  );
}
