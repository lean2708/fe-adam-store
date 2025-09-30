'use client';

import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from '@/components/modules/ThemeToggle';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on a product detail page
  const isProductDetailPage =
    pathname?.includes('/admin/products/') && pathname?.split('/').length > 4;

  return (
    <header className='h-16 bg-slate-700 border-b border-slate-600 flex items-center justify-between px-6 sticky top-0 z-10 md:rounded-tl-2xl'>
      {/* Left side - Menu toggle and back button */}
      <div className='flex items-center space-x-4 flex-1 max-w-md'>
        {/* Hamburger menu for mobile */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden text-white hover:bg-slate-600'
          onClick={onMenuToggle}
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Back button for product detail pages */}
        <div className='relative flex-1'>
          {isProductDetailPage && (
            <Button
              onClick={() => router.back()}
              variant='outline'
              size='icon'
              className='rounded-full cursor-pointer'
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
          )}
        </div>
      </div>

      {/* Right side - User info */}
      <div className='flex items-center space-x-3'>
        <ThemeToggle className='text-white hover:text-white' />
        <User className='w-5 h-5 text-white' />
        <span className='text-white text-sm font-medium'>{user?.name}</span>
      </div>
    </header>
  );
}
