import Promotions from './PaymentSection/Promotions';
import PaymentMethod from './PaymentSection/PaymentMethod';
import usePromotions from '@/hooks/(order)/usePromotions';

export function PaymentSection() {
  const { listPromotion } = usePromotions();
  return (
    <div>
      <h2 className='text-2xl font-bold text-primary mb-4'>Thanh toán</h2>

      <Promotions promotionList={listPromotion} />

      <PaymentMethod />
    </div>
  );
}
