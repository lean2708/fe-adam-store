import Footer from '@/components/templates/(marketing)/Footer/Footer';
import Navbar from '@/components/templates/Navbar/Navbar';
import { CustomerChatWidget } from '@/components/ui/CustomerChatWidget';
import { Suspense } from 'react';
import Loading from './loading';

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

      {/* Customer Chat Widget */}
      <CustomerChatWidget />
    </div>
  );
}
