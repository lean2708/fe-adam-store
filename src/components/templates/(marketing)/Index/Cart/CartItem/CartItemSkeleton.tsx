import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const CartItemSkeleton = () => {
  return (
    <Card className='border-border border-b-2 first:border-t-2'>
      <CardContent className='py-4 px-0 relative'>
        <div className='flex gap-4'>
          {/* <Checkbox className=' my-auto' /> */}
          <Skeleton className='w-16 h-16 rounded-md' />
          <div className='flex-1'>
            <div className='flex justify-between'>
              <div>
                <Skeleton className='w-32 h-5' />
                <Skeleton className='w-24 h-4 mt-1' />
              </div>

              <div className='text-right'>
                <Skeleton className='w-12 h-4' />
                <Skeleton className='w-16 h-4 mt-1' />
                <Skeleton className='w-12 h-4' />
              </div>
            </div>

            <div className='flex gap-4 mb-2'>
              <Skeleton className='w-24 h-8' />
              <Skeleton className='w-24 h-8' />
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex justify-center items-center'>
                <Skeleton className='w-8 h-8 rounded-full' />
              </div>

              <div className='flex items-center gap-2 border-boder border rounded-full'>
                <Skeleton className='w-8 h-8 rounded-full' />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItemSkeleton;
