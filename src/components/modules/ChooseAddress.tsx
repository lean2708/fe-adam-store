import { useState, useEffect } from 'react';
import { Card, CardTitle } from '../ui/card';
import { CircleX } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { updateAddressForOrderByID } from '@/actions/orderActions';
import { getAllAddressUser } from '@/actions/addressActions';
import { TAddressItem, TOrder } from '@/types';
import ConfirmDialogModule from './ConfirmDialogModule';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function ChooseAddress(props: {
  visible: boolean;
  orderItem?: TOrder;
  onSuccess: (id: TAddressItem) => void;
  onClose: () => void;
}) {
  const { visible, onSuccess, onClose, orderItem } = props;
  const t = useTranslations('Profile.address');
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [listAddress, setListAddress] = useState<TAddressItem[]>([]);

  useEffect(() => {
    async function getAddress() {
      try {
        setLoading(true);
        const res = await getAllAddressUser();
        if (res.status === 200 && res.address?.items) {
          setListAddress(res.address.items as TAddressItem[]);
        }
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally {
        setLoading(false);
      }
    }
    if (visible) {
      getAddress();
      if (listAddress.length > 0) {
        const defaultIndex = listAddress.findIndex((addr) => addr.id);
        setSelectedIndex(defaultIndex >= 0 ? defaultIndex : 0);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (listAddress.length && orderItem?.id) {
      const foundIndex = listAddress.findIndex(
        (item) => item.id === orderItem.addressId
      );
      if (foundIndex !== -1) {
        setSelectedIndex(foundIndex);
      }
    }
  }, [listAddress, orderItem]);

  const handleUpdateAddress = async () => {
    try {
      if (orderItem) {
        setIsSubmit(true);
        const res = await updateAddressForOrderByID(
          orderItem.id,
          listAddress[selectedIndex].id || 0
        );
        if (res.status === 200) {
          onSuccess(listAddress[selectedIndex]);
          onClose();
          toast.success(t('success.message_update_order'));
        }
      }
    } catch (error) {
      onClose();
    } finally {
      setConfirm(false);
      setIsSubmit(false);
    }
  };

  if (!visible) return null;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={confirm ? undefined : stopPropagation}
    >
      <Card
        className='relative w-full max-w-xl bg-white dark:bg-neutral-950 rounded-xl shadow-lg'
        onClick={stopPropagation}
      >
        <div className='!flex w-full justify-center items-center h-20 mt-2'>
          <div className='h-14 w-full flex flex-col items-center justify-between'>
            <CardTitle className='!text-2xl !font-bold'>
              {t('choose.title')}
            </CardTitle>
            <p className='text-gray-400'>{t('choose.description')}</p>
          </div>

          <button
            onClick={onClose}
            className='absolute right-6 top-7 w-auto h-auto rounded-full'
          >
            <CircleX size={30} />
          </button>
        </div>
        <ul className='pb-6 px-6'>
          {loading && <Skeleton className='h-18 w-full' />}

          {!loading &&
            listAddress.length !== 0 &&
            listAddress.map((item: TAddressItem, index) => (
              <li key={index}>
                <label
                  onClick={() => setConfirm(true)}
                  className={cn(
                    'flex items-center justify-start gap-3 h-18 w-full px-5 py-3 mt-2 rounded-lg border cursor-pointer relative transition-all',
                    selectedIndex === index ? 'border-black' : 'border-gray-300'
                  )}
                >
                  <input
                    type='radio'
                    name='address'
                    checked={selectedIndex === index}
                    onChange={() => setSelectedIndex(index)}
                    className='peer h-4 w-4 scale-100 peer inset-0 cursor-pointer appearance-none rounded-full bg-[length:24px_24px] bg-center'
                  />

                  <div className='text-left ml-2'>
                    <p
                      className={cn(selectedIndex !== index && 'text-gray-400')}
                    >
                      {(() => {
                        const phoneNumber = item.phone?.startsWith('0')
                          ? item.phone.slice(1)
                          : item.phone;

                        return `(+84) ${phoneNumber?.slice(
                          0,
                          3
                        )} ${phoneNumber?.slice(3, 6)} ${phoneNumber?.slice(
                          6
                        )}`;
                      })()}
                    </p>
                    <p
                      className={cn(
                        'font-medium',
                        selectedIndex !== index && 'text-gray-400'
                      )}
                    >
                      {item.streetDetail}, {item.ward?.name},{' '}
                      {item.district?.name}, {item.province?.name}
                    </p>
                  </div>
                </label>
              </li>
            ))}
          <li className='h-14 w-full mt-3 flex justify-center items-center border-gray-600 border rounded-lg font-medium cursor-pointer'>
            {t('action.add_new')}
          </li>
        </ul>
      </Card>
      <ConfirmDialogModule
        loading={isSubmit}
        onClose={() => setConfirm(false)}
        title={t('action.confirm_change')}
        onSubmit={() => {
          handleUpdateAddress();
        }}
        confirm={confirm}
      />
    </div>
  );
}
