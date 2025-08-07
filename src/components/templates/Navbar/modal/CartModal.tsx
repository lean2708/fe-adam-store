import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Modal, ModalBody } from '@/components/ui/modal';
import { useTranslations, useLocale } from 'next-intl';
import { cn, formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { TCartItem } from '@/types';
import { manrope } from '@/config/fonts';
import { Checkbox } from '@/components/ui/checkbox';

export default function CartModal({
  open,
  cartItems,
  totalPrice,
  onClose,
}: {
  open: boolean;
  cartItems: TCartItem[];
  totalPrice: number;
  onClose: () => void;
}) {
  const t = useTranslations('Header');
  const locale = useLocale();

  const router = useRouter();

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
            <span className='font-bold text-primary text-sm'>
              {formatCurrency(totalPrice, locale)}
            </span>{' '}
            ({cartItems.length} {t('cart.products')})
          </div>
          <div className='text-sm font-bold'>
            {t('cart.selected')}: {cartItemCount}
          </div>
        </div>

        {/* Cart Items */}
        <div className='space-y-2 mb-6 overflow-y-auto'>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-start space-x-3 ',
                item.id === item.id
                  ? 'hover:bg-accent p-2 rounded-sm hover:outline-offset-8'
                  : ''
              )}
            >
              <div className='flex-shrink-0'>
                <Image
                  src={item.Product.mainImage || '/placeholder.svg'}
                  alt={item.Product.name || 'Product Image'}
                  width={90}
                  height={110}
                  className='rounded-md object-cover'
                />
              </div>
              <div className='flex-1 grid grid-rows-2 gap-2'>
                <div className='min-w-0'>
                  <h4 className='text-base font-bold text-primary truncate'>
                    {item.Product.name}
                  </h4>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {item.color}/ {item.size}
                  </p>
                </div>

                <div className='mt-1'>
                  <p className='text-base font-bold text-primary'>
                    {formatCurrency(1000, locale)}
                  </p>
                  <p className='text-base text-primary'>x{item.quantity}</p>
                </div>
              </div>
              <div className='flex flex-col items-center justify-between h-32'>
                <button className=' p-1'>
                  <X className='h-4 w-4 text-muted-foreground hover:text-red-500' />
                </button>
                <Checkbox className='size-6' />
              </div>
            </div>
          ))}
        </div>
        {/* Cart Actions */}
        <div className='space-y-2'>
          <Button
            variant={'default'}
            className='w-full  py-3 rounded-md font-medium'
            onClick={onClose}
          >
            {t('cart.buyNow')}
          </Button>
          <Button
            variant='outline'
            className='w-full  py-3 rounded-md font-medium '
            onClick={() => {
              router.push('/cart');
              onClose();
            }}
          >
            {t('cart.viewCart')}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
