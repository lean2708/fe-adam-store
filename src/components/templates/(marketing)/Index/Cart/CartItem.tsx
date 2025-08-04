"\"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { CartItem } from './CartItemsList';

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (id: string, change: number) => void;
}

export function CartItemComponent({ item, onQuantityChange }: CartItemProps) {
  return (
    <Card className='border-[#e8e8e8]'>
      <CardContent className='p-4'>
        <div className='flex gap-4'>
          <Checkbox className='' />
          <Image
            src={item.image || '/placeholder.svg'}
            alt={item.name}
            width={100}
            height={100}
            className='rounded-lg object-cover'
          />
          <div className='flex-1'>
            <h3 className='font-medium text-[#000000] mb-1'>{item.name}</h3>
            <p className='text-sm text-[#888888] mb-2'>Màu sắc: {item.color}</p>
            <div className='flex gap-4 mb-2'>
              <Select defaultValue={item.selectedColor}>
                <SelectTrigger className='w-24 h-8 text-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {item.colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue={item.selectedSize}>
                <SelectTrigger className='w-16 h-8 text-sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {item.sizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className='text-xs text-[#888888] cursor-pointer hover:underline'>
              Xóa
            </span>
          </div>
          <div className='text-right'>
            <div className='text-sm text-[#888888] line-through mb-1'>
              {item.originalPrice.toLocaleString('vi-en')} VNĐ × {item.quantity}
            </div>
            <div className='font-semibold text-[#000000] mb-2'>
              {(item.price * item.quantity).toLocaleString('vi-en')} VNĐ
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 bg-transparent'
                onClick={() => onQuantityChange(item.id, -1)}
              >
                <Minus className='h-3 w-3' />
              </Button>
              <span className='w-8 text-center text-sm'>{item.quantity}</span>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 bg-transparent'
                onClick={() => onQuantityChange(item.id, 1)}
              >
                <Plus className='h-3 w-3' />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
