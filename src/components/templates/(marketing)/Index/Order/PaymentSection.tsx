import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BadgePercent, Truck } from 'lucide-react';
import Image from 'next/image';

export function PaymentSection() {
  return (
    <div>
      <h2 className='text-2xl font-bold text-primary mb-4'>Thanh toán</h2>

      <div className='mb-4'>
        <p className=' text-primary font-bold mb-3'>Mã giảm giá</p>

        <Select>
          <SelectTrigger className='w-full h-16 p-3 border border-border rounded-2xl bg-background text-muted-foreground font-medium justify-between'>
            <div className='flex items-center gap-2'>
              <BadgePercent className='size-6' />
              <SelectValue placeholder='Chọn mã giảm giá' />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none'>Không có mã giảm giá</SelectItem>
            <SelectItem value='new10'>NEWUSER10 - Giảm 10%</SelectItem>
            <SelectItem value='save20'>SAVE20 - Giảm 20%</SelectItem>
            <SelectItem value='vip30'>VIP30 - Giảm 30%</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
    </div>
  );
}
