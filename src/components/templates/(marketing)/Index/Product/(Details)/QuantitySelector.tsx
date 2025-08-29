import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const t = useTranslations('Marketing.product_details');

  return (
    <div>
      <label className='block text-sm font-medium text-primary mb-2'>
        {t('product_infor.quantity')}:
      </label>
      <div className='flex items-center gap-2'>
        <Button
          size={'icon'}
          variant={'outline'}
          onClick={onDecrease}
          className='flex items-center justify-center cursor-pointer'
        >
          -
        </Button>
        <span className='w-12 text-center'>{quantity}</span>
        <Button
          size={'icon'}
          variant={'outline'}
          onClick={onIncrease}
          className='flex items-center justify-center cursor-pointer'
        >
          +
        </Button>
      </div>
    </div>
  );
}
