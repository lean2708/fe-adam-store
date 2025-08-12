import Navbar from '@/components/templates/Navbar/Navbar';
import { Suspense } from 'react';
import Loading from '../(marketing)/loading';
import { cn } from '@/lib/utils';
import { manrope } from '@/config/fonts';

export default async function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn('min-h-screen adam-store-bg', manrope.className)}>
      <Navbar />

      <div>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
