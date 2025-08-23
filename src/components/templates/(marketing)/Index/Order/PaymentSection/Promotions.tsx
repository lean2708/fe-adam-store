import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TPromotion } from '@/types';
import { BadgePercent } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

interface PromotionsProps {
  promotionList: TPromotion[];
  promotion: TPromotion | null;
  onPromotionChange: (value: string) => void;
}

const Promotions = ({
  promotionList,
  promotion,
  onPromotionChange,
}: PromotionsProps) => {
  const t = useTranslations('Order.promotion');

  const handleValueChange = (value: string) => {
    if (value === '' || value === 'none') {
      // Handle clearing selection
      onPromotionChange('');
    } else {
      onPromotionChange(value);
    }
  };

  const currentValue = promotion?.id ? promotion.id.toString() : '';
  return (
    <div className='mb-4'>
      <p className=' text-primary font-bold mb-3'>{t('title')}</p>

      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className='w-full h-16 p-3 border border-border rounded-2xl bg-background text-muted-foreground font-medium justify-between'>
          <div className='flex items-center gap-2'>
            <BadgePercent className='size-6' />
            <SelectValue placeholder={t('placeholder')} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {promotionList.length === 0 && (
            <SelectItem key={1} value={'none'}>
              {t('no_promotion')}
            </SelectItem>
          )}
          {promotionList.map((promo) => (
            <SelectItem key={promo.id} value={promo.id?.toString()!}>
              {promo.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Promotions;
