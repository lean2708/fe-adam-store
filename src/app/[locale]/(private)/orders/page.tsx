import '@/app/globals.css';
import { ContentOrder } from '@/components/templates/(private)/orders/ContentOrder';

export default function OrderPage() {
  return (
    <main className='max-w-7xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Đơn hàng của tôi</h1>
      <ContentOrder />
    </main>
  );
}