import { formatCurrency } from '@/lib/utils';
import React from 'react';

function Fee({
  subtotal,
  shippingFee,
}: {
  subtotal: number;
  shippingFee: number;
}) {
  return (
    <div className='space-y-3 border-border border-b-2 pb-4'>
      <div className='flex justify-between text-sm text-primary'>
        <span className=''>Tổng tiền hàng</span>
        <span className='font-medium'>{formatCurrency(subtotal)}</span>
      </div>
      <div className='flex justify-between text-sm text-primary'>
        <span className=''>Phí vận chuyển</span>
        <span className='font-medium'>
          {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
        </span>
      </div>
    </div>
  );
}

export default Fee;
