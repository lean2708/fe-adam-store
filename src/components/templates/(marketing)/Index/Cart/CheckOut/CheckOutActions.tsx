import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const CheckOutActions = () => {
  const t = useTranslations('Header');

  const router = useRouter();

  const selectedItems = useCartStore((state) => state.selectedItems);

  return (
    <div className='space-y-3 '>
      <Button
        onClick={() => router.push('/order')}
        className='w-full cursor-pointer py-3 font-medium'
        disabled={selectedItems.length === 0}
      >
        {t('cart.checkOut.action.order')}
      </Button>
      <Button
        variant='outline'
        onClick={() => router.push('/')}
        className='w-full cursor-pointer py-3 font-medium'
      >
        {t('cart.checkOut.action.continue_to_buy')}
      </Button>
    </div>
  );
};

export default CheckOutActions;
