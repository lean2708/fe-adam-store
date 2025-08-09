import { Modal, ModalBody } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { manrope } from '@/config/fonts';
import { CartItemModalSkeleton } from '@/components/ui/skeleton';
import { TCartItem } from '@/types';

interface UnauthenticatedModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CartModalSkeleton({
  open,
  onClose,
}: UnauthenticatedModalProps) {
  const t = useTranslations('Header');

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant='dropdown'
      size='md'
      position='top-right'
      showOverlay={true}
    >
      <ModalBody
        className={cn('bg-background max-h-[70vh]', manrope.className)}
      >
        {/* Cart Header */}
        <div className='flex justify-between items-center mb-4'>
          <div className='text-sm text-muted-foreground'>
            {t('cart.subtotal')}:{' '}
            <span className='font-bold text-primary text-sm'>0</span> ( 0{' '}
            {t('cart.products')})
          </div>
          <div className='text-sm font-bold'>{t('cart.selected')}: 0</div>
        </div>

        {/* Cart Items */}
        <div className='space-y-2 mb-6 overflow-y-auto max-h-[50vh]'>
          {Array.from({ length: 2 }).map((_, idx) => (
            <CartItemModalSkeleton
              key={idx}
              className='flex items-start space-x-3 hover:bg-accent p-2 rounded-sm transition-colors'
            />
          ))}
        </div>

        {/* Cart Actions */}
        <div className='space-y-2'>
          <Button
            variant={'default'}
            className='w-full py-3 rounded-md font-medium'
            disabled
          >
            {t('cart.buyNow')}
          </Button>
          <Button
            variant='outline'
            className='w-full py-3 rounded-md font-medium'
            disabled
          >
            {t('cart.viewCart')}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
