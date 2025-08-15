'use client';

import { Button } from '@/components/ui/button';
import useAddress from '@/hooks/(order)/useAddress';
import { useAuth } from '@/hooks/useAuth';
import { AddressItem } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import AddressSectionModal from './Address/AddressSectionModal';
import { AddNewAddressModal } from './Address/AddNewAddressModal';

// DeliveryInfo.tsx
export function DeliveryInfo() {
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

  // Xử lý loading state
  if (loading) {
    return <p>Đang tải địa chỉ...</p>;
  }

  // Xử lý khi không có địa chỉ
  if (!deliveryAddress) {
    return (
      <div>
        <div className='flex flex-row items-center justify-between mb-3'>
          <h2 className='text-2xl font-bold text-primary'>Giao hàng</h2>
          <Button
            variant='outline'
            className='px-6 py-5 font-medium text-primary rounded-full'
            asChild
          >
            <Link href='/account/address/add'>Thêm địa chỉ</Link>
          </Button>
        </div>
        <p className='text-muted-foreground'>
          Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
        </p>
      </div>
    );
  }

  // Hiển thị thông tin địa chỉ
  return (
    <div>
      <div className='flex flex-row items-center justify-between mb-3'>
        <h2 className='text-2xl font-bold text-primary'>Giao hàng</h2>
        <Button
          variant='outline'
          className='px-6 py-5 font-medium text-primary rounded-full'
          onClick={() => setIsVisible(true)}
        >
          Chỉnh sửa
        </Button>
      </div>
      <div className='flex flex-row gap-12'>
        <div className='flex flex-col justify-between text-muted-foreground gap-2'>
          <span>Họ và tên:</span>
          <span>Địa chỉ nhận hàng:</span>
          <span>Số điện thoại:</span>
        </div>
        <div className='flex flex-col justify-between text-muted-foreground gap-2'>
          <span>{user?.name}</span>
          <span>
            {deliveryAddress.streetDetail},{deliveryAddress.ward?.name},
            {deliveryAddress.district?.name},{deliveryAddress.province?.name}
          </span>
          <span>{deliveryAddress.phone}</span>
        </div>
      </div>

      <AddressSectionModal
        visible={isVisible}
        addressList={listAddress}
        currentAddressId={currentAddress.id}
        onClose={() => setIsVisible(false)}
        onSelectAddress={(address: AddressItem) => {
          setCurrentAddress(address);
        }}
        onAddNewAddress={() => setIsAddModalVisible(true)}
      />

      <AddNewAddressModal
        open={isAddModalVisible}
        onclose={() => setIsAddModalVisible(false)}
        onSaveSuccess={handleAddressAdded}
      />
    </div>
  );
}
