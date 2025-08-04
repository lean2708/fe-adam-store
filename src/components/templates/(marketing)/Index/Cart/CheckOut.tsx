'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CheckOutProps {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export function CheckOut({
  itemCount,
  subtotal,
  shipping,
  total,
}: CheckOutProps) {
  return (
    <Card className='rounded-xl border border-gray-200 bg-white text-gray-950 shadow dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50'>
      <CardContent className='p-6 '>
        <h2 className='font-bold text-lg text-primary mb-4'>
          Tổng đơn hàng ({itemCount} sản phẩm)
        </h2>

        <div className='space-y-3  border-border border-b-2 pb-4'>
          <div className='flex justify-between text-sm text-primary'>
            <span className=''>Tổng cộng</span>
            <span className='font-medium'>
              {subtotal.toLocaleString('vi-en')} VNĐ
            </span>
          </div>
          <div className='flex justify-between text-sm text-primary'>
            <span className=''>Phí vận chuyển</span>
            <span className='font-medium'>
              {shipping === 0
                ? 'Miễn phí'
                : `${shipping.toLocaleString('vi-en')} VNĐ`}
            </span>
          </div>
        </div>

        <div className='flex justify-between items-center border-border border-b-2 font-semibold text-lg my-4 pb-4'>
          <span className='text-primary font-medium text-sm'>Tổng cộng</span>
          <span className='text-primary font-bold text-2xl'>
            {total.toLocaleString('vi-en')} VNĐ
          </span>
        </div>

        <div className='space-y-3 '>
          <Button className='w-full cursor-pointer py-3 font-medium'>
            Đặt hàng
          </Button>
          <Button
            variant='outline'
            className='w-full cursor-pointer py-3 font-medium'
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
