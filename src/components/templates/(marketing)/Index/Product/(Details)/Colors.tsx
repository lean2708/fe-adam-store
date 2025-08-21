'use client';

import { cn } from '@/lib/utils';
import { TColor, TVariant } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type ColorsProps = {
  tColors: TColor[];
  onChangeColor: (color: number | undefined) => void;
};

export default function Colors({ tColors, onChangeColor }: ColorsProps) {
  const t = useTranslations('Marketing.product_details');

  const [selectedColor, setSelectedColor] = useState<number | undefined>(
    undefined
  );

  const onSelectColor = (color: number) => {
    setSelectedColor(color);
    onChangeColor(color);
  };

  return (
    <div>
      <label className='block text-sm font-medium text-primary mb-2'>
        {t('product_infor.colors')}:
      </label>
      <div className=' flex gap-2'>
        {tColors.map((tColor) => (
          <button
            key={tColor.id}
            className={cn(
              'w-14 h-8 rounded-full border border-accent-foreground [&.active]:outline [&.active]:outline-offset-2 [&.active]:outline-accent-foreground transition-all duration-200 hover:scale-110',
              tColor?.id === selectedColor && 'active'
            )}
            style={{ backgroundColor: tColor.name }}
            onClick={() => onSelectColor(tColor.id)}
          ></button>
        ))}
      </div>
    </div>
  );
}
