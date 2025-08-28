import Footer from '@/components/templates/(marketing)/Footer/Footer';
import Navbar from '@/components/templates/Navbar/Navbar';
import { Suspense } from 'react';
import Loading from '../(marketing)/loading';

export default async function authLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen adam-store-bg-light'>
      <Navbar />

      <div>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
      <Footer />
    </div>
  );
}
