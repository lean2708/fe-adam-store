import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function ProductActions({
  onAddToCart,
  onBuyNow,
  loading,
}: {
  onAddToCart: () => void;
  onBuyNow: () => void;
  loading: {
    isAddingToCart: boolean;
    isBuyingNow: boolean;
    isPending: boolean;
  };
}) {
  const t = useTranslations('Marketing.product_details');

  return (
    <div className='flex w-full gap-2 '>
      <Button
        variant={'outline'}
        onClick={onAddToCart}
        className='px-5 sm:px-10 py-6 sm:py-4 t rounded-md font-semibold text-primary text-base md:text-lg cursor-pointer'
        disabled={loading.isAddingToCart}
      >
        {t('product_infor.product_actions.add_to_cart')}
      </Button>
      <Button
        variant={'default'}
        onClick={onBuyNow}
        className='px-12 py-6 sm:py-4 min-w-fit  rounded-md font-semibold  text-base md:text-lg cursor-pointer'
        disabled={loading.isPending || loading.isBuyingNow}
      >
        {t('product_infor.product_actions.buy_now')}
      </Button>
    </div>
  );
}
