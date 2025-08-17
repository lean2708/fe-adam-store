import { DeliveryInfo } from '@/components/templates/(marketing)/Index/Order/DeliveryInfo';
import { PaymentBar } from '@/components/templates/(marketing)/Index/Order/PaymentBar';
import { PaymentSection } from '@/components/templates/(marketing)/Index/Order/PaymentSection';
import { PaymentSummary } from '@/components/templates/(marketing)/Index/Order/PaymentSummary';
import { ProductList } from '@/components/templates/(marketing)/Index/Order/ProductList';
import { Separator } from '@/components/ui/separator';

function OrderPage() {
  return (
    <div className='adam-store-bg'>
      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-8'>
        <h1 className=' text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold text-primary text-center mb-12'>
          Xác nhận đơn hàng
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32'>
          {/* Left Column - Order Details */}
          <div className='space-y-6 col-span-2'>
            <DeliveryInfo />
            <Separator />
            <PaymentSection />
            <Separator />
            <PaymentSummary />
            <Separator />
          </div>

          {/* Right Column - Products */}
          <ProductList />
        </div>
      </main>

      <PaymentBar />
    </div>
  );
}

export default OrderPage;
