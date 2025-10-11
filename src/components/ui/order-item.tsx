import { cn, formatCurrency } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialogModule from '../modules/ConfirmDialogModule';
import { cancelOrderAction } from '@/actions/orderActions';
import { TabStatus, TOrderItem } from '@/types';
import { toast } from 'sonner';
import ReviewModule from '../modules/ReviewModule';
import { Button } from './button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function OrderItem(props: {
  onDeleted: (id: number) => void;
  onRetryPay: () => void;
  id: number;
  activeStatus: TabStatus;
  totalPrice?: number;
  items?: TOrderItem[];
  openModule: () => void;
}) {
  const t = useTranslations('Profile.my_orders');

  const btnByStatus: Record<TabStatus, React.ReactNode> = {
    PENDING: (
      <>
        <button
          onClick={() => onRetryPay()}
          className='w-52 mr-4 px-6 md:px-4 py-4 md:py-2rounded-md border border-[#888888] text-sm'
        >
          {t('actions.retry_payment')}
        </button>
        <button
          onClick={() => openModule()}
          className='w-52  mr-4  px-6 md:px-4 py-4 md:py-2 rounded-md border border-[#888888] text-sm'
        >
          {t('actions.change_address')}
        </button>
        <button
          onClick={() => {
            setIsDeleted(true);
          }}
          className='w-40  px-6 md:px-4 py-4 md:py-2 border-[#888888] border text-black rounded-md text-sm'
        >
          {t('actions.cancel_order')}
        </button>
      </>
    ),
    PROCESSING: (
      <>
        <button
          onClick={() => openModule()}
          className='md:w-52 w-full md:mr-4  px-6 md:px-4 py-4 md:py-2 rounded-md border border-[#888888] text-sm'
        >
          {t('actions.change_address')}
        </button>
        <div className='md:block flex justify-between my-4'>
          <button
            onClick={() => {
              setIsDeleted(true);
            }}
            className='w-40 mr-4  px-6 md:px-4 py-4 md:py-2 border-[#888888] border text-black rounded-md text-sm'
          >
            {t('actions.cancel_order')}
          </button>
          <button className='w-40  px-6 md:px-4 py-4 md:py-2  rounded-md border border-[#C5C4C2] text-sm text-[#C5C4C2] bg-[#E5E4E1]'>
            {t('actions.wait')}
          </button>
        </div>
      </>
    ),
    SHIPPED: (
      <>
        <button className='w-56 text-gray-400 px-4 py-2 rounded-md border border-gray-400 text-sm'>
          {t('actions.confirm_received')}
        </button>
      </>
    ),
    DELIVERED: (
      <>
        <button className='w-40 px-6 md:px-4 py-4 md:py-2 border border-[#888888] rounded-md text-sm mr-4'>
          {t('actions.contact_us')}
        </button>
        <button className='w-28 px-6 md:px-4 py-4 md:py-2 bg-black text-white rounded-md text-sm'>
          {t('actions.buy_again')}
        </button>
      </>
    ),
    CANCELLED: (
      <>
        <button className='w-28 px-6 md:px-4 py-4 md:py-2 bg-black text-white rounded-md text-sm'>
          {t('actions.buy_again')}
        </button>
      </>
    ),
  };

  const {
    onDeleted,
    onRetryPay,
    id,
    items,
    activeStatus,
    openModule,
    totalPrice,
  } = props;
  const [dropList, setDropList] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!items) return null;

  const CloseOrder = async () => {
    try {
      setLoading(true);
      if (items[selectedIndex].id) {
        const res = await cancelOrderAction(String(id));
        if (res.status === 200) {
          setIsDeleted(false);
          onDeleted(id);
          toast.success(t('messages.cancel_success'));
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!dropList && <ItemProductOrder item={items[0]} active={activeStatus} />}
      {dropList &&
        items.map((item: TOrderItem) => (
          <ItemProductOrder key={item.id} item={item} active={activeStatus} />
        ))}
      {!dropList && items.length > 1 && (
        <button
          onClick={() => setDropList(true)}
          className='outline-none w-full flex justify-center py-2 border-b-1 border-dashed'
        >
          <p>{t('actions.view_more')}</p>
          <ChevronDown className='ml-3' />
        </button>
      )}
      <div className='w-full text-end pt-2'>
        {t('summary.total_amount', { count: items.length })} &nbsp;&nbsp;&nbsp;
        <span className='text-xl font-bold'>
          {totalPrice && formatCurrency(totalPrice)}
        </span>
      </div>
      <div className='py-2 text-end'>{btnByStatus[activeStatus]}</div>
      <ConfirmDialogModule
        loading={loading}
        onClose={() => setIsDeleted(false)}
        title={t('confirm.cancel_order')}
        onSubmit={() => {
          CloseOrder();
        }}
        confirm={isDeleted}
      />
    </>
  );
}

function ItemProductOrder(props: { item: TOrderItem; active: TabStatus }) {
  const { item, active } = props;
  const [isReview, setIsReview] = useState(false);
  const t = useTranslations('Profile.my_orders');

  return (
    <div className='border-b-1 border-dashed py-2 w-full flex justify-between min-h-25 items-center'>
      <div className='flex '>
        <Image
          width={100}
          height={100}
          className='h-25 rounded-sm'
          src={item.imageUrl}
          alt={'' + item.image?.id}
        />
        <div className='h-full flex flex-col justify-between ml-3'>
          <h4 className='font-bold text-sm md:text-base'>
            {item.Product?.title}
          </h4>
          <p className='text-[#888888]'>
            {t('order_details.product_list.color')}: {item.color}
          </p>
          <p className='text-[#888888]'>
            {t('order_details.product_list.size')}: {item.size}
          </p>
          <p className='text-[#888888]'>×{item.quantity}</p>
        </div>
      </div>
      <p
        className={cn(
          active === 'DELIVERED' &&
            'h-25 flex flex-col justify-between items-end'
        )}
      >
        <span className='font-bold'>
          {formatCurrency(Number(item.unitPrice))}
        </span>
        {active === 'DELIVERED' && (
          <Button
            onClick={() => setIsReview(true)}
            className='px-4 py-2  min-w-[100px] flex items-center justify-center '
          >
            {item.isReview ? t('review.view_review') : t('review.write_review')}
          </Button>
        )}
      </p>
      <ReviewModule
        visible={isReview}
        orderItem={item}
        onClose={() => setIsReview(false)}
        returnRivew={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </div>
  );
}
