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
    <Card className='border-[#e8e8e8] sticky top-4'>
      <CardContent className='p-6'>
        <h2 className='font-semibold text-[#000000] mb-4'>
          Tổng đơn hàng ({itemCount} sản phẩm)
        </h2>

        <div className='space-y-3 mb-4'>
          <div className='flex justify-between text-sm'>
            <span className='text-[#888888]'>Tổng cộng</span>
            <span className='text-[#000000]'>
              {subtotal.toLocaleString('vi-en')} VNĐ
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-[#888888]'>Phí vận chuyển</span>
            <span className='text-[#000000]'>
              {shipping === 0
                ? 'Miễn phí'
                : `${shipping.toLocaleString('vi-en')} VNĐ`}
            </span>
          </div>
        </div>

        <span className='border-secondary dark:border-secondary-dark h-full w-1 border-l'></span>

        <div className='flex justify-between font-semibold text-lg mb-6'>
          <span className='text-[#000000]'>Tổng cộng</span>
          <span className='text-[#000000]'>
            {total.toLocaleString('vi-en')} VNĐ
          </span>
        </div>

        <div className='space-y-3'>
          <Button className='w-full bg-[#000000] hover:bg-[#131313] text-[#ffffff] py-3'>
            Đặt hàng
          </Button>
          <Button
            variant='outline'
            className='w-full border-[#e8e8e8] text-[#000000] py-3 bg-transparent'
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
