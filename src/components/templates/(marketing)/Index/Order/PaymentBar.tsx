'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useCalculateTotal from '@/hooks/(order)/useCalculateTotal';
import { formatCurrency } from '@/lib/utils';
import { useLocale } from 'next-intl';
import Image from 'next/image';

export function PaymentBar() {
  const locale = useLocale();

  const { total, isCalculatingTotal } = useCalculateTotal();

  return (
    <div className='fixed bottom-0 left-0 right-0 border-t-2 border-border bg-background'>
      <div className='max-w-screen flex items-center justify-between h-[10vh]'>
        <Button
          variant={'outline'}
          className='text-muted-foreground flex items-center justify-center gap-4 rounded-none hover:bg-accent h-full w-1/4 px-4'
        >
          <Image
            width={32}
            height={32}
            src='/imgs/vn-pay-logo.png'
            alt='VNPAY'
            className='h-6'
          />
          Thanh toán qua VNPAY
        </Button>

        <Separator orientation='vertical' className='' />

        <Button
          variant={'outline'}
          className='rounded-none h-full w-1/4 px-4 text-muted-foreground'
        >
          Mã giảm giá
        </Button>

        <Separator orientation='vertical' className='' />

        <div className='flex items-center justify-center px-4 h-full w-1/4'>
          <p className='text-xl font-bold text-primary'>
            {isCalculatingTotal
              ? 'Đang tính...'
              : formatCurrency(total, locale)}
          </p>
        </div>

        <Separator orientation='vertical' className='' />

        <Button
          variant={'default'}
          className='text-xl h-full rounded-none  w-1/4 px-4'
        >
          Đặt hàng
        </Button>
      </div>
    </div>
  );
}
