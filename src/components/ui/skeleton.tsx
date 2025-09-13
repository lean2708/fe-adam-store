import { cn } from '@/lib/utils';
import { Card, CardContent } from './card';
import { Checkbox } from './checkbox';
import { Button } from './button';

type TSkeletonProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:adam-store-bg-light',
        className
      )}
      {...props}
    />
  );
}

function ProductCardSkeleton({ className }: TSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      <Skeleton className='aspect-[3/4] rounded-lg mb-3' />
      <Skeleton className='h-4 rounded mb-2' />
      <Skeleton className='h-4 rounded w-2/3' />
    </div>
  );
}

function CategorySkeleton({ className }: TSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      <Skeleton className='aspect-square rounded-lg mb-2' />
      <Skeleton className='h-4 rounded w-3/4 mx-auto' />
    </div>
  );
}

function ProductCardWithColorsSkeleton({ className }: TSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      <Skeleton className='aspect-[3/4] rounded-lg mb-3' />
      <div className='flex gap-2 mb-3'>
        <Skeleton className='w-12 h-7 rounded-full' />
        <Skeleton className='w-12 h-7 rounded-full' />
      </div>
      <Skeleton className='h-4 rounded mb-2' />
      <Skeleton className='h-4 rounded w-2/3' />
    </div>
  );
}

function CartItemSkeleton({ className }: TSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      <Card className='border-border border-b-2 first:border-t-2'>
        <CardContent className='py-4 px-0 relative'>
          <div className='flex gap-4'>
            {/* Checkbox skeleton */}
            <Skeleton className='size-5 rounded border my-auto' />

            {/* Image skeleton */}
            <Skeleton className='w-[135px] h-[202px] rounded-lg object-cover' />

            {/* Info grid */}
            <div className='grid grid-rows-3 w-full'>
              {/* Top row: name, color, price */}
              <div className='flex justify-between'>
                <div>
                  <Skeleton className='h-6 w-xs rounded mb-1' />
                  <Skeleton className='h-4 w-28 rounded mb-2' />
                </div>
                <div className='text-right'>
                  <Skeleton className='h-6 w-28 rounded mb-1 ml-auto' />
                  <Skeleton className='h-4 w-24 rounded mb-2 ml-auto' />
                </div>
              </div>

              {/* Middle row: colors, sizes */}
              <div className='flex gap-4 mb-2 -mt-2'>
                {/* Colors skeleton */}
                <div className='flex gap-1'>
                  <Skeleton className='w-28 h-9 rounded-full' />
                </div>
                {/* Sizes skeleton */}
                <div className='flex gap-1'>
                  <Skeleton className='w-28 h-9 rounded-full' />
                </div>
              </div>

              {/* Bottom row: remove button, quantity */}
              <div className='flex items-end-safe justify-between'>
                <div className='flex justify-center items-center'>
                  <Skeleton className='h-5 w-16 rounded' />
                </div>
                <div className='flex gap-2'>
                  <Skeleton className='w-28 h-9 rounded-full' />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CartItemModalSkeleton({ className }: TSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className='flex-shrink-0'>
        <Skeleton className='h-[132px] w-[90px] rounded-md object-cover' />
      </div>
      <div className='flex-1 grid grid-rows-2 gap-2'>
        <div className='min-w-0'>
          <Skeleton className='h-6 w-44' />
          <Skeleton className='h-4 w-24 mt-2' />
        </div>
        <div className='mt-1'>
          <Skeleton className='h-6 w-24 mb-2' />
          <Skeleton className='h-6 w-16' />
        </div>
      </div>
      <div className='flex flex-col items-center justify-between h-32'>
        <Skeleton className='size-6 mb-2 rounded' />
        <Checkbox className='size-6' disabled />
      </div>
    </div>
  );
}

function UserModalSkeleton({ className }: TSkeletonProps) {
  return (
    <div className='fixed inset-0 bg-black/30 z-[9998]'>
      <div
        style={{
          position: 'absolute',
          width: '338px',
          minHeight: '224px',
          top: '80px',
          right: '25px',
          borderRadius: '8px',
          padding: '16px',
          zIndex: 9999,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        className={cn(
          'border border-border bg-primary-foreground animate-pulse',
          className
        )}
      >
        {/* Skeleton cho phần chào mừng */}
        <div className='mb-2 p-3 bg-muted/50 rounded-lg'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-5 w-[150px]' />
          </div>
        </div>

        {/* Skeleton cho một mục menu (ví dụ: Profile, My Orders) */}
        <div className='flex items-center h-16 gap-3 px-3 py-1'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <Skeleton className='h-6 w-[120px]' />
        </div>

        {/* Lặp lại cho mục menu thứ hai */}
        <div className='flex items-center h-16 gap-3 px-3 py-1'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <Skeleton className='h-6 w-[130px]' />
        </div>

        {/* Skeleton cho mục Logout */}
        <div className='flex items-center h-16 gap-3 px-3 py-1'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <Skeleton className='h-6 w-[100px]' />
        </div>
      </div>
    </div>
  );
}

function CartModalWithoutLoginSkeleton({ className }: TSkeletonProps) {
  return (
    <div className='fixed inset-0 bg-black/30 z-[9998]'>
      <div
        style={{
          position: 'absolute',
          top: '80px',
          right: '50px',
          zIndex: 9999,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
        }}
        className={cn('', className)}
      >
        <div className='adam-store-bg max-h-[60vh] w-[360px] rounded-lg shadow-lg py-8 px-4'>
          {/* Cart Items Skeleton */}
          <div className='space-y-2 mb-6 overflow-y-auto max-h-[50vh]'>
            <div className='flex items-center flex-col justify-center gap-4 p-2 rounded-sm  transition-colors'>
              <Skeleton className='h-6 w-1/2' />
              <Skeleton className='h-4 w-10/12' />
            </div>
          </div>

          {/* Cart Actions Skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-8 w-full rounded-md' />
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  Skeleton,
  ProductCardSkeleton,
  CategorySkeleton,
  ProductCardWithColorsSkeleton,
  CartItemSkeleton,
  CartItemModalSkeleton,

  // *Modal Skeleton
  UserModalSkeleton,
  CartModalWithoutLoginSkeleton,
};
