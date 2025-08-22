import { Button } from '@/components/ui/button';
import { SIZE_LIST } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { TColor } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type SizesProps = {
  tColor: TColor;
  onChangeSize: (size: number | undefined) => void;
};

export default function Sizes({ tColor, onChangeSize }: SizesProps) {
  const t = useTranslations('Marketing.product_details');

  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    undefined
  );

  const onSelectSize = (sizeId: number | undefined, disabled: boolean) => {
    if (disabled) return;
    setSelectedSize(sizeId);
    onChangeSize(sizeId);
  };

  return (
    <div>
      <span className='block text-sm font-medium text-primary mb-2'>
        {t('product_infor.sizes')}:
      </span>
      <div className='flex gap-2'>
        {SIZE_LIST.map((size) => {
          // Tìm variant có size tương ứng
          const variant = tColor.variants?.find(
            (v) => v.size?.name === size.name
          );
          const isAvailable = !!variant;
          const isActive = variant?.size?.id === selectedSize;

          return (
            <Button
              key={size.key}
              variant='outline'
              className={cn(
                'w-14 h-fit cursor-pointer px-2 sm:px-3 py-1 text-base text-accent-foreground text-center font-extralight rounded-full transition-colors border shadow-sm ',
                isActive &&
                  'bg-primary dark:!bg-primary text-primary-foreground dark:!text-primary-foreground border-accent-foreground hover:bg-primary hover:text-primary-foreground ',
                !isAvailable &&
                  'bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60'
              )}
              disabled={!isAvailable}
              onClick={() =>
                onSelectSize(variant?.size?.id ?? undefined, !isAvailable)
              }
            >
              {size.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
