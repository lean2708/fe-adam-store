import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {};

const CheckOutActions = (props: Props) => {
  const router = useRouter();
  return (
    <div className='space-y-3 '>
      <Button className='w-full cursor-pointer py-3 font-medium'>
        Đặt hàng
      </Button>
      <Button
        variant='outline'
        onClick={() => router.push('/')}
        className='w-full cursor-pointer py-3 font-medium'
      >
        Tiếp tục mua sắm
      </Button>
    </div>
  );
};

export default CheckOutActions;
