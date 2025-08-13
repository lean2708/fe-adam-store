import { useState, useEffect } from 'react';
import { Card, CardTitle } from '../ui/card';
import { CircleX } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { AddressItem, TOrder } from '@/types';
import { updateAddressForOrderByID } from '@/actions/orderActions';
import { getAllAddressUser } from '@/actions/addressActions';
import Link from 'next/link';
import ConfirmDialogModule from './ConfirmDialogModule';
import { toast } from 'sonner';

export default function ChooseAddress(props: {
  visible: boolean;
  onSuccess: (address: AddressItem) => void;
  orderItem?: TOrder;
  onClose: () => void;
}) {
  const { visible, onClose, orderItem, onSuccess } = props;
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [listAddress, setListAddress] = useState<AddressItem[]>([]);

  useEffect(() => {
    const defaultIndex = listAddress.findIndex((addr) => addr.isDefault);
    setSelectedIndex(defaultIndex >= 0 ? defaultIndex : 0);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  useEffect(() => {
    async function getAddress() {
      try {
        setLoading(true);
        const res = await getAllAddressUser();
        console.log(res);
        if (res.status === 200 && res.address?.items) {
          setListAddress(res.address.items as AddressItem[]);
        }
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally {
        setLoading(false);
      }
    }
    getAddress();
  }, [visible]);
  useEffect(() => {
    if (listAddress.length && orderItem?.address?.id) {
      const foundIndex = listAddress.findIndex(
        (item) => item.id === orderItem?.address.id
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
        console.log(res);
        if (res.status === 200) {
          onSuccess(listAddress[selectedIndex]);
          onClose();
          toast.success('Cập nhật địa chỉ thành công');
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
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40',
        isSubmit && 'cursor-wait'
      )}
      onClick={isSubmit ? undefined : () => onClose()}
    >
      <Card
        className='relative w-full max-w-xl bg-white dark:bg-neutral-950 rounded-xl shadow-lg'
        onClick={stopPropagation}
      >
        <div className='!flex w-full justify-center items-center h-20 mt-2'>
          <div className='h-14 w-full flex flex-col items-center justify-between'>
            <CardTitle className='!text-2xl !font-bold'>Chọn địa chỉ</CardTitle>
            <p className='text-gray-400'>Chọn 1 trong các địa chỉ bạn đã lưu</p>
          </div>

          <button
            onClick={onClose}
            className='absolute right-6 top-7 w-auto h-auto rounded-full'
          >
            <CircleX size={30} />
          </button>
        </div>

        {/* Body */}
        <ul className='pb-6 px-6'>
          {loading && <Skeleton className='h-18 w-full' />}
          {!loading &&
            listAddress.length !== 0 &&
            listAddress.map((item: AddressItem, index) => (
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
                    className='peer h-4 w-4 scale-100 hidden'
                  />

                  <div className='text-left ml-2'>
                    <p
                      className={cn(
                        'font-medium',
                        !item.isDefault && 'text-gray-400'
                      )}
                    >
                      (+84) {item.phone}
                    </p>
                    <p
                      className={cn(
                        'font-medium',
                        !item.isDefault && 'text-gray-400'
                      )}
                    >
                      {item.streetDetail}, {item.ward?.name},{' '}
                      {item.district?.name}, {item.province?.name}
                    </p>
                    {item.isDefault && (
                      <span className='absolute -top-3 left-5 px-2 py-0.5 bg-white'>
                        Mặc định
                      </span>
                    )}
                  </div>
                </label>
              </li>
            ))}
          <Link
            href={'/address'}
            className='h-14 w-full mt-3 flex justify-center items-center border-gray-600 border rounded-lg font-medium cursor-pointer'
          >
            Thêm địa chỉ mới
          </Link>
        </ul>
      </Card>
      <ConfirmDialogModule
        loading={isSubmit}
        onClose={() => setConfirm(false)}
        title='Bạn có chắc muốn thay đổi địa chỉ ?'
        onSubmit={() => {
          handleUpdateAddress();
        }}
        confirm={confirm}
      />
    </div>
  );
}
// props: { loading: boolean, onClose: () => void, title: string, confirm: boolean, onSubmit: () => void
