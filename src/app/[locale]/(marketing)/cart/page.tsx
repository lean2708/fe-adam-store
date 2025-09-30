import { CartItemsList } from '@/components/templates/(marketing)/Index/Cart/CartItemsList';
import { CheckOut } from '@/components/templates/(marketing)/Index/Cart/CheckOut';
import { cn } from '@/lib/utils';
import { manrope } from '@/config/fonts';
import { getTranslations } from 'next-intl/server';

export default async function CartPage() {
  const t = await getTranslations('Header');

  return (
    <div className='min-h-screen adam-store-bg'>
      <main className={cn(`max-w-7xl mx-auto px-4 py-8`, manrope.className)}>
        <h1 className='hidden lg:block text-3xl md:text-4xl xl:text-5xl font-semibold text-primary text-center mb-8'>
          {t('cart.title')}
        </h1>

        <div className='grid lg:grid-cols-3 gap-8'>
          <CartItemsList />

          <div className='lg:col-span-1'>
            <CheckOut />
          </div>
        </div>
      </main>
    </div>
  );
}
