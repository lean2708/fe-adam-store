import { formatCurrency } from '@/lib/utils';
import { useLocale } from 'next-intl';
import React from 'react';

const Total = ({ total }: { total: number }) => {
  const locale = useLocale();
  return (
    <div className='flex justify-between items-center border-border border-b-2 font-semibold text-lg my-4 pb-4'>
      <span className='text-primary font-medium text-sm'>Tổng cộng</span>
      <span className='text-primary font-bold text-2xl'>
        {formatCurrency(total, locale)}
      </span>
    </div>
  );
};

export default Total;
