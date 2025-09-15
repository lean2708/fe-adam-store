import Footer from '@/components/templates/(marketing)/Footer/Footer';
import Navbar from '@/components/templates/Navbar/Navbar';
import { CustomerChatWidget } from '@/components/ui/CustomerChatWidget';
import { Suspense } from 'react';
import Loading from './loading';
import type { Metadata } from 'next';
import { generateBaseMetadata } from '@/lib/metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateBaseMetadata(locale);
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen adam-store-bg-light'>
      <Navbar />

      <div className='min-h-screen'>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>

      <Footer />

      {/* Customer Chat Widget */}
      <CustomerChatWidget />
    </div>
  );
}
