import { DeliveryInfo } from '@/components/templates/(marketing)/Index/Order/DeliveryInfo';
import { PaymentBar } from '@/components/templates/(marketing)/Index/Order/PaymentBar';
import { PaymentSection } from '@/components/templates/(marketing)/Index/Order/PaymentSection';
import { PaymentSummary } from '@/components/templates/(marketing)/Index/Order/PaymentSummary';
import { ProductList } from '@/components/templates/(marketing)/Index/Order/ProductList';
import { Separator } from '@/components/ui/separator';
import { getTranslations } from 'next-intl/server';

async function OrderPage() {
  const t = await getTranslations('Order');

  return (
    <div className='adam-store-bg-light'>
      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-8'>
        <h1 className='md:block hidden text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold text-primary text-center mb-12'>
          {t('title')}
        </h1>

        {/* ---------------------Mobile View Layout --------------------- */}
        <div className='flex flex-col gap-6 md:hidden mb-20'>
          <DeliveryInfo />
          <ProductList />
          <PaymentSection />
          <PaymentSummary />
        </div>

        {/* --------------------- Desktop View Layout --------------------- */}
        <div className='hidden md:grid md:grid-cols-3 gap-6 mb-32'>
          {/* Cột trái (Chiếm 2 cột) */}
          <div className='col-span-1 md:col-span-2 space-y-6'>
            <DeliveryInfo />
            <Separator className='hidden sm:block' />
            <PaymentSection />
            <Separator className='hidden sm:block' />
            <PaymentSummary />
            <Separator className='hidden sm:block' />
          </div>

          <div className='flex gap-4'>
            <Separator
              orientation={'vertical'}
              className='m-0 p-0 hidden md:block'
            />
            {/* Right Column - Products */}
            <ProductList />
          </div>
        </div>
      </main>

      <PaymentBar />
    </div>
  );
}

export default OrderPage;
