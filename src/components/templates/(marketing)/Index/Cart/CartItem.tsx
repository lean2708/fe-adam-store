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
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { CartItem } from './CartItemsList';
import { cn } from '@/lib/utils';
import { roboto } from '@/config/fonts';

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (id: string, change: number) => void;
}

export function CartItemComponent({ item, onQuantityChange }: CartItemProps) {
  return (
    <Card className='border-border border-b-2 first:border-t-2'>
      <CardContent className='py-4 px-0 relative'>
        <div className='flex gap-4'>
          <Checkbox className=' my-auto' />
          <Image
            src={item.image || '/placeholder.svg'}
            alt={item.name}
            width={100}
            height={100}
            className='rounded-lg object-cover'
          />
          <div className='flex-1'>
            <div className='flex justify-between'>
              <div>
                <h3 className='font-bold text-primary mb-1'>{item.name}</h3>
                <p
                  className={cn(
                    `text-sm text-muted-foreground mb-2`,
                    roboto.className
                  )}
                >
                  Màu sắc: {item.color}
                </p>
              </div>

              <div className='text-right'>
                <p className='text-sm text-primary font-normal  mb-1'>
                  {item.originalPrice.toLocaleString('vi-en')} VNĐ ×{' '}
                  {item.quantity}
                </p>
                <p className='font-bold text-primary mb-2'>
                  {(item.price * item.quantity).toLocaleString('vi-en')} VNĐ
                </p>
              </div>
            </div>

            <div className='flex gap-4 mb-2'>
              <Select defaultValue={item.selectedColor}>
                <SelectTrigger className='w-28 h-9 text-sm bg-accent'>
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
                <SelectTrigger className='max-w-20 h-9 text-sm bg-accent'>
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

            <div className='flex items-center justify-between'>
              <div className='flex justify-center items-center'>
                <Trash2 className='size-5 mr-1 text-muted-foreground' />
                <span className='text-muted-foreground font-medium cursor-pointer hover:underline '>
                  Xóa
                </span>
              </div>

              <div className='flex items-center gap-2 border-boder border rounded-full'>
                <Button
                  size='icon'
                  className='h-8 w-8 bg-transparent text-primary shadow-none hover:bg-transparent cursor-pointer'
                  onClick={() => onQuantityChange(item.id, -1)}
                >
                  <Minus className='h-3 w-3' />
                </Button>
                <span className='w-8 text-center '>{item.quantity}</span>
                <Button
                  size='icon'
                  className='h-8 w-8 bg-transparent text-primary shadow-none hover:bg-transparent cursor-pointer'
                  onClick={() => onQuantityChange(item.id, 1)}
                >
                  <Plus className='h-3 w-3' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
