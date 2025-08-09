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
import { useCartStore } from '@/stores/cartStore';
import { useCartItem } from '@/hooks/(cart)/useCartItem';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CartItemModal from './CartItemModal';

export default function CartModal({
  userId,
  open,
  onClose,
}: {
  userId: number;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();

  // Lấy dữ liệu từ store
  const cartItems = useCartStore((state) => state.cartItems);
  const selectedTotalPrice = useCartStore((state) => state.selectedTotalPrice);
  const selectedItems = useCartStore((state) => state.selectedItems);
  const status = useCartStore((state) => state.status);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const toggleItemSelection = useCartStore(
    (state) => state.toggleItemSelection
  );

  const [isLoading, setIsLoading] = useState(false);

  // Fetch dữ liệu khi mở modal
  useEffect(() => {
    if (open && userId) {
      setIsLoading(true);
      fetchCart(userId).finally(() => setIsLoading(false));
    }
  }, [open, userId, fetchCart]);

  if (isLoading || status === 'loading') {
    return (
      <Modal
        open={open}
        onClose={onClose}
        variant='dropdown'
        size='md'
        position='top-right'
        showOverlay={true}
      >
        <ModalBody className={cn('bg-background', manrope.className)}>
          <div className='flex justify-center items-center h-40'>
            Loading...
          </div>
        </ModalBody>
      </Modal>
    );
  }

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
              {formatCurrency(Number(selectedTotalPrice), locale)}
            </span>{' '}
            ({cartItems.length} {t('cart.products')})
          </div>
          <div className='text-sm font-bold'>
            {t('cart.selected')}: {selectedItems.length}
          </div>
        </div>

        {/* Cart Items */}
        <div className='space-y-2 mb-6 overflow-y-auto max-h-[50vh]'>
          {cartItems.map((cartItem) => (
            <CartItemModal
              key={cartItem.id}
              cartItem={cartItem}
              product={cartItem.Product}
              selected={selectedItems.includes(Number(cartItem.id))}
              onSelect={() => toggleItemSelection(Number(cartItem.id))}
            />
          ))}
        </div>

        {/* Cart Actions */}
        <div className='space-y-2'>
          <Button
            variant={'default'}
            className='w-full py-3 rounded-md font-medium'
            onClick={onClose}
          >
            {t('cart.buyNow')}
          </Button>
          <Button
            variant='outline'
            className='w-full py-3 rounded-md font-medium'
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
