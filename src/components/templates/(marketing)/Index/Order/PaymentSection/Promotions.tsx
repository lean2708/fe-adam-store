import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TPromotion } from '@/types';
import { Value } from '@radix-ui/react-select';
import { BadgePercent } from 'lucide-react';
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
  return (
    <div className='mb-4'>
      <p className=' text-primary font-bold mb-3'>Mã giảm giá</p>

      <Select
        value={promotion?.id?.toString() || ''}
        onValueChange={(value) => onPromotionChange(value)}
      >
        <SelectTrigger className='w-full h-16 p-3 border border-border rounded-2xl bg-background text-muted-foreground font-medium justify-between'>
          <div className='flex items-center gap-2'>
            <BadgePercent className='size-6' />
            <SelectValue placeholder={'Chọn mã giảm giá'} />
          </div>
        </SelectTrigger>
        <SelectContent>
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
