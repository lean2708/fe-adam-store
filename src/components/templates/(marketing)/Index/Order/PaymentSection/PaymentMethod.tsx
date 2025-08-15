import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Truck } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type Props = {};

function PaymentMethod({}: Props) {
  return (
    <div className='mb-6'>
      <p className='text-primary font-bold mb-3'>Phương thức thanh toán</p>
      <RadioGroup defaultValue='vnpay' className='space-y-3'>
        <div className='flex items-center gap-2 p-3 border border-border rounded-lg'>
          <RadioGroupItem value='cod' id='cod' className='border-border ' />
          <Label
            htmlFor='cod'
            className='h-fit py-1 flex-1 font-medium text-muted-foreground cursor-pointer flex items-center'
          >
            <Truck className='size-6 mx-2' />
            Thanh toán khi nhận hàng
          </Label>
        </div>
        <div className='flex items-center gap-2 p-3 border-2 border-primary rounded-2xl'>
          <RadioGroupItem
            value='vnpay'
            id='vnpay'
            className='border-primary text-primary'
          />
          <Label
            htmlFor='vnpay'
            className='h-fit  font-medium flex flex-1  items-center gap-2 text-primary cursor-pointer'
          >
            <Image
              width={32}
              height={32}
              src='/imgs/vn-pay-logo.png'
              alt='VNPAY'
            />
            Thanh toán qua VNPAY
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default PaymentMethod;
