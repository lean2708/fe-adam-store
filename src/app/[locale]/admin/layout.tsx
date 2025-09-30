'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/templates/admin/AdminSidebar';
import AdminHeader from '@/components/templates/admin/AdminHeader';
import Spinner from '@/components/ui/Spinner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='flex h-screen'>
        <AdminSidebar
          mobileOpen={mobileMenuOpen}
          onMobileOpenChange={setMobileMenuOpen}
        />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <AdminHeader onMenuToggle={() => setMobileMenuOpen(true)} />
          <main className='flex-1 py-6 px-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
