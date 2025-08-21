'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { getAllOrderUserAction } from '@/actions/orderActions';
import { retryPaymentviaVnPayAction } from '@/actions/orderActions';
import { Skeleton } from '@/components/ui/skeleton';
import ChooseAddress from '@/components/modules/ChooseAddress';
import { AddressItem, TOrderItem, TOrder } from '@/types';
import OrderItem from '@/components/ui/order-item';
import { toast } from 'sonner';

type TabStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

interface TabItem {
  key: TabStatus;
  label: string;
}

const tabList: TabItem[] = [
  { key: 'PENDING', label: 'Đơn hàng chờ xác nhận' },
  { key: 'PROCESSING', label: 'Đơn hàng đang xử lý' },
  { key: 'SHIPPED', label: 'Đơn hàng đã gửi đi' },
  { key: 'DELIVERED', label: 'Đơn hàng đã giao' },
  { key: 'CANCELLED', label: 'Đơn hàng đã huỷ' },
];

export default function OrderPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemOnModule, setItemOnModule] = useState<TOrder>();
  const [activeStatus, setActiveStatus] = useState<TabStatus>('PENDING');
  const [listOrders, setListOrders] = useState<TOrder[]>([]);

  const router = useRouter();

  useEffect(() => {
    getData();
  }, [activeStatus]);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await getAllOrderUserAction(activeStatus);
      console.log(res);
      if (res.status === 200 && res.orders) {
        setListOrders(res.orders as TOrder[]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = async (orderId: number) => {
    try {
      const res = await retryPaymentviaVnPayAction(orderId);

      if (res.success && res.data?.paymentUrl) {
        router.push(res.data.paymentUrl);
      } else {
        toast.error('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Failed to retry payment:', error);
      toast.error('Có lỗi xảy ra khi tạo liên kết thanh toán.');
    }
  };

  return (
    <main className='max-w-7xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Đơn hàng của tôi</h1>
      <div className='rounded-xl border-2 border-black dark:border-white'>
        <div className='flex border-b border-black dark:border-white !box-border overflow-auto pt-2'>
          {tabList.map((tab) => (
            <button
              key={tab.key}
              className={clsx(
                'outline-none whitespace-nowrap mx-4 h-full dark:text-white text-black py-2 text-sm font-medium transition-colors',
                activeStatus === tab.key &&
                  'border-b-3 border-black dark:border-white'
              )}
              onClick={() => {
                if (activeStatus !== tab.key) {
                  setListOrders([]);
                  setActiveStatus(tab.key);
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className='px-8 py-6'>
          <div className='rounded-xl px-5 bg-gray-100'>
            <h3 className='border-b-1 h-11 flex items-center justify-end border-gray-400 border-dashed font-semibold uppercase'>
              {tabList.find((tab) => tab.key === activeStatus)?.label}
            </h3>
            <div>
              {isLoading && (
                <div className='py-3 border-b-2 flex w-full justify-between h-24 items-center'>
                  <Skeleton className='h-16 w-full' />
                </div>
              )}
              {!isLoading &&
                listOrders.length > 0 &&
                listOrders.map((item: TOrder, index: number) => {
                  const isLast = index === listOrders.length - 1;
                  return (
                    <div
                      key={item.id}
                      className={clsx(
                        '',
                        !isLast && 'border-b-1 border-dashed'
                      )}
                    >
                      <OrderItem
                        onDeleted={(id: number) => {
                          if (id) {
                            const updatedOrders = [...listOrders];
                            const foundIndex = updatedOrders.findIndex(
                              (item) => item.id === id
                            );
                            if (foundIndex !== -1) {
                              updatedOrders.splice(foundIndex, 1);
                              setListOrders(updatedOrders);
                            }
                          }
                        }}
                        onRetryPay={() => handleRetryPayment(item.id)}
                        id={item.id}
                        items={item.orderItems as TOrderItem[]}
                        totalPrice={item.totalPrice}
                        activeStatus={activeStatus}
                        openModule={() => {
                          setIsVisible(true);
                          setItemOnModule(item);
                        }}
                      />
                    </div>
                  );
                })}
              {!isLoading && (!listOrders || listOrders.length === 0) && (
                <p className='py-3 border-b-1 flex w-full h-16 items-center justify-center'>
                  Bạn chưa có đơn hàng nào cả
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChooseAddress
        visible={isVisible}
        orderItem={itemOnModule}
        onClose={() => setIsVisible(false)}
        onSuccess={(address: AddressItem) => {
          if (listOrders.length && address && itemOnModule) {
            const foundIndex = listOrders.findIndex(
              (item) => item.id === itemOnModule.id
            );
            if (foundIndex !== -1) {
              const updatedOrders = [...listOrders];
              updatedOrders[foundIndex] = {
                ...updatedOrders[foundIndex],
                address: address,
              };
              setListOrders(updatedOrders);
              setIsLoading(false);
            }
          }
        }}
      />
    </main>
  );
}
