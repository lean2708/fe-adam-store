import React from 'react';
import Loader from '@/components/modules/Loader';
import { TColor } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const Colors = React.memo(
  ({
    cartItemId,
    color,
    productColors,
    onChangeColor,
    isChanging,
  }: {
    cartItemId: string;
    color: string;
    productColors: TColor[];
    onChangeColor: (color: number | undefined) => void;
    isChanging?: boolean;
  }) => {
    const colorName = productColors.find(
      (item) => item.name?.toString() === color?.toString()
    )?.id;

    return (
      <Select
        value={colorName?.toString()}
        onValueChange={(value) => onChangeColor(Number(value))}
        disabled={isChanging}
      >
        <SelectTrigger
          className='w-28 h-9 text-sm bg-accent'
          disabled={isChanging}
        >
          {isChanging ? (
            <Loader2 className='animate-spin size-4 ' />
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          {productColors.map((productColor) => (
            <SelectItem
              key={productColor.id}
              value={productColor.id!.toString()}
              className={`${isChanging ? 'bg-muted-foreground' : ''}`}
              disabled={productColor.name === color}
            >
              {productColor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

Colors.displayName = 'Colors';
export default Colors;
