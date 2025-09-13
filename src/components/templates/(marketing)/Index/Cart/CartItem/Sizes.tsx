import { TEntityBasic } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

const Sizes = memo(
  ({
    size,
    productSizes,
    onChangeSize,
    isChanging,
  }: {
    cartItemId: string;
    size: string;
    productSizes: TEntityBasic[];
    onChangeSize: (size: number) => void;
    isChanging?: boolean;
  }) => {
    const sizeName = productSizes.find(
      (item) => item.name?.toString() === size?.toString()
    )?.id;

    return (
      <Select
        value={sizeName?.toString()}
        onValueChange={(value) => onChangeSize(Number(value))}
        disabled={isChanging}
      >
        <SelectTrigger
          className='w-28 h-9 text-sm bg-accent'
          disabled={isChanging}
          aria-label='Choose size'
        >
          {isChanging ? (
            <Loader2 className='animate-spin size-4 ' />
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          {productSizes.map((size) => (
            <SelectItem
              key={size.id}
              value={size.id!.toString()}
              className={`${isChanging ? 'bg-muted-foreground' : ''}`}
              disabled={size.name === size}
            >
              {size.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

Sizes.displayName = 'Sizes';
export default Sizes;
