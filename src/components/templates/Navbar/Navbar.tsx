'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { ShoppingBag, User, Menu, ArrowLeft } from 'lucide-react';

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
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn, shouldHideByPathAndDevice } from '@/lib/utils';
import { manrope } from '@/config/fonts';
import useIsMobile from '@/hooks/useIsMobile';

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
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  const unAllowPaths = ['/cart', '/order'];

  const pathWithoutLocale = pathname.replace(/^\/[a-zA-Z-]+/, '');

  // Check if should hide navbar - only after component mounts
  const shouldHideNavbar =
    isMounted && shouldHideByPathAndDevice(pathname, isMobile, unAllowPaths);

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

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  let title = '';
  if (pathWithoutLocale === '/cart') {
    title = t('Header.cart.title') + ` (${cartItems.length})`;
  } else if (pathWithoutLocale === '/order') {
    title = t('Order.title');
  }

  // Don't render anything until we know the client state
  if (!isMounted) {
    return (
      <header className='border-b adam-store-border adam-store-bg relative h-16 flex items-center' />
    );
  }

  if (isMobile && shouldHideNavbar) {
    return (
      <header className='border-b adam-store-border adam-store-bg relative h-16 flex items-center'>
        <button
          data-slot='button'
          className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-md mx-2 h-9 px-3 py-2 bg-transparent hover:bg-muted transition-colors'
          aria-label='Go back'
          onClick={() => router.back()}
        >
          <ArrowLeft className='size-5' />
        </button>
        <div className='flex-1 text-start'>
          <span className={cn('font-bold text-lg', manrope.className)}>
            {title}
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className='border-b adam-store-border adam-store-bg relative h-16 flex items-center'>
      {isMobile && shouldHideNavbar && (
        <>
          <button
            data-slot='button'
            className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-md mx-2 h-9 px-3 py-2 bg-transparent hover:bg-muted transition-colors'
            aria-label='Go back'
            onClick={() => router.back()}
          >
            <ArrowLeft className='size-5' />
          </button>
          <div className='flex-1 text-start'>
            <span className={cn('font-bold text-lg', manrope.className)}>
              {title}
            </span>
          </div>
        </>
      )}

      {!(isMobile && shouldHideNavbar) && (
        <>
          <div>
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
                    onClick={() => {
                      if (isMobile) {
                        router.push('/cart');
                      } else {
                        setIsCartOpen(true);
                      }
                    }}
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
          </div>
          {/* Language Switcher  */}
          <div className='absolute left-20 top-0 h-16 flex items-center z-10'>
            <NavigationLocaleSwitcherPublic />
          </div>
        </>
      )}

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
