'use client';

import { Separator } from '@/components/ui/separator';
import useAddress from '@/hooks/(order)/useAddress';
import useProductVariant from '@/hooks/(order)/useProductVariant';
import usePromotions from '@/hooks/(order)/usePromotions';
import useShippingFee from '@/hooks/useShippingFee';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { usePromotionStore } from '@/stores/promotionStore';
import { useLocale } from 'next-intl';

export function PaymentSummary() {
  const locale = useLocale();
  const { currentAddress } = useAddress();
  const { productVariantList } = useProductVariant();
  const selectedTotalPrice = useCartStore((s) => s.selectedTotalPrice);
  const { selectedPromotion } = usePromotionStore();

  const { shippingFee, calculatingShipping, error } = useShippingFee(
    currentAddress,
    productVariantList
  );

  const calculateDiscount = () => {
    if (!selectedPromotion) return 0;

    const subtotal = selectedTotalPrice;

    // Tính giảm giá theo %
    if (selectedPromotion.discountPercent) {
      let discount = subtotal * (selectedPromotion.discountPercent / 100);

      return discount;
    }

    return 0;
  };

  const discount = calculateDiscount(); // Tạm thời chưa xử lý mã giảm giá
  const total = selectedTotalPrice + (shippingFee || 0) - discount;

  if (error) {
    console.log(error);
  }

  return (
    <div className='space-y-3 text-sm'>
      <h4 className='text-2xl font-bold text-primary mb-4'>
        Chi tiết thanh toán
      </h4>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>Tạm tính</span>
        <span>{formatCurrency(selectedTotalPrice, locale)}</span>
      </div>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>Phí vận chuyển</span>
        <span>
          {calculatingShipping
            ? 'Đang tính...'
            : `${formatCurrency(shippingFee || 0, locale)}`}
        </span>
      </div>
      <div className='flex justify-between text-muted-foreground'>
        <span className=''>Mã giảm giá</span>
        <span>{formatCurrency(discount, locale)}</span>
      </div>
      <Separator className='mt-4' />
      <div className='text-primary font-bold  pt-3 flex justify-between'>
        <span className=''>Thành tiền</span>
        <span>{formatCurrency(total, locale)}</span>
      </div>
    </div>
  );
}
