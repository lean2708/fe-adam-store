import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus } from 'lucide-react';
import { memo } from 'react';

const Quantity = memo(
  ({
    quantity,
    maxQuantity,
    onIncrease,
    onDecrease,
    isUpdating,
  }: {
    quantity: number;
    maxQuantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    isUpdating?: boolean;
  }) => {
    return (
      <div className='flex items-center gap-2 border border-border rounded-full'>
        <Button
          size='icon'
          className={cn(
            'h-8 w-8 bg-transparent text-primary hover:bg-muted rounded-bl-2xl rounded-tl-2xl cursor-pointer',
            isUpdating && 'opacity-50 cursor-not-allowed'
          )}
          onClick={onDecrease}
          disabled={isUpdating || quantity <= 1}
          aria-label='Decrease quantity'
        >
          <Minus className='h-3 w-3' />
        </Button>

        <div className='w-8 text-center'>
          {isUpdating ? (
            <Loader2 className='animate-spin size-4 mx-auto' />
          ) : (
            quantity
          )}
        </div>

        <Button
          size='icon'
          className={cn(
            'h-8 w-8 bg-transparent text-primary hover:bg-muted rounded-br-2xl rounded-tr-2xl cursor-pointer',
            isUpdating && 'opacity-50 cursor-not-allowed'
          )}
          onClick={onIncrease}
          disabled={isUpdating || quantity >= maxQuantity}
          aria-label='Increase quantity'
        >
          <Plus className='h-3 w-3' />
        </Button>
      </div>
    );
  }
);

Quantity.displayName = 'Quantity';
export default Quantity;
