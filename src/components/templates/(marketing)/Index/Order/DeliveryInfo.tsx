'use client';

import { Button } from '@/components/ui/button';
import useAddress from '@/hooks/(order)/useAddress';
import { useAuth } from '@/hooks/useAuth';
import { TAddressItem } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import useIsMobile from '@/hooks/useIsMobile';

// *Dynamic import cho Modal components
const AddressSectionModal = dynamic(
  () => import('./Address/AddressSectionModal'),
  {
    ssr: false,
  }
);

const AddNewAddressModal = dynamic(
  () => import('./Address/AddNewAddressModal'),
  {
    ssr: false,
  }
);

export function DeliveryInfo() {
  const t = useTranslations('Order.delivery_info');
  const isMobile = useIsMobile();

  const { user } = useAuth();
  const { currentAddress, loading, listAddress, setCurrentAddress } =
    useAddress();

  const [isVisible, setIsVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const deliveryAddress = currentAddress;

  const handleAddressAdded = () => {
    setIsVisible(false);
    if (listAddress.length === 0) {
      setIsVisible(true);
    }
  };

  if (loading) {
    return (
      <div className={cn(isMobile && 'border-border border p-4 rounded-md')}>
        <div className='flex flex-row items-center justify-between mb-3'>
          <h2 className='text-2xl font-bold text-primary'>{t('title')}</h2>
          <Skeleton className='w-32 h-10 rounded-full' />
        </div>
        <div className='flex flex-row gap-12'>
          <div className='hidden md:flex flex-col justify-between text-muted-foreground gap-2'>
            <span>Họ và tên:</span>
            <span>Địa chỉ nhận hàng:</span>
            <span>Số điện thoại:</span>
          </div>
          <div className='flex flex-col justify-between text-muted-foreground gap-2'>
            <Skeleton className='w-sm h-6 rounded-full' />
            <Skeleton className='w-sm h-6 rounded-full' />
            <Skeleton className='w-sm h-6 rounded-full' />
          </div>
        </div>
      </div>
    );
  }

  if (!deliveryAddress) {
    return (
      <div>
        <div className='flex flex-row items-center justify-between mb-3'>
          <h2 className='text-2xl font-bold text-primary'> {t('title')}</h2>
          <Button
            variant='outline'
            className='px-6 py-5 font-medium text-primary rounded-full'
            asChild
          >
            <Link href='/address'>{t('action.add_address')}</Link>
          </Button>
        </div>
        <p className='text-muted-foreground'>{t('no_address')}</p>
      </div>
    );
  }

  return (
    <div className={cn(isMobile && 'border-border border p-4 rounded-md')}>
      <div className='flex flex-row items-center justify-between mb-3'>
        <h2 className='text-2xl font-bold text-primary'>{t('title')}</h2>
        <Button
          variant='outline'
          className='px-6 py-5 font-medium text-primary rounded-full'
          onClick={() => setIsVisible(true)}
        >
          {t('action.edit_address')}
        </Button>
      </div>
      <div className='flex flex-row gap-12'>
        <div className='hidden md:flex flex-col justify-between text-muted-foreground gap-2'>
          <span>{t('info_receiver.name')}:</span>
          <span>{t('info_receiver.address')}:</span>
          <span>{t('info_receiver.phone')}:</span>
        </div>
        <div className='flex flex-col justify-between text-muted-foreground gap-2'>
          <span className='font-bold'>{user?.name}</span>
          <span>
            {deliveryAddress.streetDetail},{deliveryAddress.ward?.name},
            {deliveryAddress.district?.name},{deliveryAddress.province?.name}
          </span>
          <span>{deliveryAddress.phone}</span>
        </div>
      </div>

      {/* Address Picker Modal */}
      <AddressSectionModal
        visible={isVisible}
        addressList={listAddress}
        currentAddressId={currentAddress.id}
        onClose={() => setIsVisible(false)}
        onSelectAddress={(address: TAddressItem) => {
          setCurrentAddress(address);
        }}
        onAddNewAddress={() => setIsAddModalVisible(true)}
      />

      {/* Add New Address Modal */}
      <AddNewAddressModal
        open={isAddModalVisible}
        onclose={() => setIsAddModalVisible(false)}
        onSaveSuccess={handleAddressAdded}
      />
    </div>
  );
}
