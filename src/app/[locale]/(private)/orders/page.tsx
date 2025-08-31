import '@/app/globals.css';
import { ContentOrder } from '@/components/templates/(private)/orders/ContentOrder';
import { getTranslations } from 'next-intl/server';

export default async function OrderPage() {
  const t = await getTranslations('Profile.my_orders');

  return (
    <main className='max-w-7xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>{t('title')}</h1>
      <ContentOrder />
    </main>
  );
}
