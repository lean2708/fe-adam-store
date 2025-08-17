'use client';

import { Separator } from '@/components/ui/separator';
import useAddress from '@/hooks/(order)/useAddress';
import useCalculateTotal from '@/hooks/(order)/useCalculateTotal';
import useProductVariant from '@/hooks/(order)/useProductVariant';
import usePromotions from '@/hooks/(order)/usePromotions';
import useShippingFee from '@/hooks/useShippingFee';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useLocale } from 'next-intl';

export function PaymentSummary() {
  const locale = useLocale();
  const { currentAddress } = useAddress();
  const { productVariantList } = useProductVariant();
  const selectedTotalPrice = useCartStore((s) => s.selectedTotalPrice);
  const { calculateDiscount } = usePromotions();

  const { shippingFee } = useShippingFee(currentAddress, productVariantList);

  const { total, isCalculatingTotal, calculatingShipping } =
    useCalculateTotal();

  const discount = calculateDiscount(selectedTotalPrice);

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
        <span>
          {isCalculatingTotal ? 'Đang tính...' : formatCurrency(total, locale)}
        </span>
      </div>
    </div>
  );
}
