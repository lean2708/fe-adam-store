import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function ProductActions({
  onAddToCart,
  onBuyNow,
}: {
  onAddToCart: () => void;
  onBuyNow: () => void;
}) {
  const t = useTranslations('Marketing.product_details');

  return (
    <div className='flex gap-2 justify-center'>
      <Button
        variant={'outline'}
        onClick={onAddToCart}
        className='px-10 py-3 flex-1 rounded-md font-semibold text-primary text-xl cursor-pointer'
      >
        {t('product_infor.product_actions.add_to_cart')}
      </Button>
      <Button
        variant={'default'}
        onClick={onBuyNow}
        className='px-10 py-3 flex-1 rounded-md font-semibold text-xl cursor-pointer'
      >
        {t('product_infor.product_actions.buy_now')}
      </Button>
    </div>
  );
}
