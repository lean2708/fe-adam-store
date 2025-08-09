import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {};

const CheckOutActions = (props: Props) => {
  const t = useTranslations('Header');

  const router = useRouter();
  return (
    <div className='space-y-3 '>
      <Button className='w-full cursor-pointer py-3 font-medium'>
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
