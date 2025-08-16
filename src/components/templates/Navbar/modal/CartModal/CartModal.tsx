import { Button } from '@/components/ui/button';
import { Modal, ModalBody } from '@/components/ui/modal';
import { useTranslations, useLocale } from 'next-intl';
import { cn, formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { manrope } from '@/config/fonts';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';
import CartItemModal from './CartItemModal';
import EmptyCart from '@/components/templates/(marketing)/Index/Cart/EmptyCart';
import { useAuth } from '@/hooks/useAuth';
import CartModalUnauthenticated from './CartModalUnauthenticated';
import CartModalSkeleton from './CartModalSkeleton';

export default function CartModal({
  userId,
  open,
  onClose,
}: {
  userId: number;
  open: boolean;
  onClose: () => void;
}) {
  const { user, isLogin } = useAuth();

  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();

  // Lấy dữ liệu từ store
  const cartItems = useCartStore((state) => state.cartItems);
  const setOrderSelectedItems = useCartStore(
    (state) => state.setOrderSelectedItems
  );
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

  const handleBuyNow = () => {
    const selectedItemsData = cartItems.filter((item) =>
      selectedItems.includes(Number(item.id))
    );

    setOrderSelectedItems(selectedItemsData);

    router.push('/order');
    onClose();
  };

  if (isLoading || status === 'loading') {
    return <CartModalSkeleton open={open} onClose={onClose} />;
  }

  if (!user || !isLogin) {
    return <CartModalUnauthenticated open={open} onClose={onClose} />;
  }

  return (
    <>
      {cartItems.length === 0 ? (
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
            <EmptyCart className='my-6 py-0 border-none' />
          </ModalBody>
        </Modal>
      ) : (
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
                onClick={handleBuyNow}
                disabled={selectedItems.length === 0}
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
      )}
    </>
  );
}
