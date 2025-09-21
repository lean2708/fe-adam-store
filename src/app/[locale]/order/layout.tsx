import Navbar from '@/components/templates/Navbar/Navbar';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { manrope } from '@/config/fonts';
import Loading from './loading';

export default async function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn('min-h-screen adam-store-bg', manrope.className)}>
      <Navbar />

      <div className='mx-4'>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
