'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import OrderItem from '@/components/ui/order-item';
import { getAllOrderUserAction } from '@/actions/orderActions';
import { Skeleton } from '@/components/ui/skeleton';
type TabStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
interface TabItem {
  key: TabStatus;
  label: string;
}
const tabList: TabItem[] = [
  { key: 'PENDING', label: 'Đơn hàng chờ xử lý' },
  { key: 'PROCESSING', label: 'Đơn hàng đang xử lý' },
  { key: 'SHIPPED', label: 'Đơn hàng đã gửi đi' },
  { key: 'DELIVERED', label: 'Đơn hàng đã giao' },
  { key: 'CANCELLED', label: 'Đơn hàng đã huỷ' },
];

export default function OrderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeStatus, setActiveStatus] = useState<TabStatus>('PENDING');
  const [data, setData] = useState<any>({})
  const btnByStatus: Record<TabStatus, React.ReactNode> = {
    PENDING: <><button className='w-60 px-4 mr-4 py-2 rounded-md border border-black'>Thay đổi địa chỉ nhận hàng</button><button className='w-60 px-4 py-2 bg-black text-white rounded-md'>Hủy</button></>,
    PROCESSING: <><button className='w-60 px-4 mr-4 py-2 rounded-md border border-black'>Thay đổi địa chỉ nhận hàng</button><button className='w-60 px-4 py-2 bg-black text-white rounded-md'>Hủy</button></>,
    SHIPPED: <><p className="h-full flex items-center">{data.length != 0 && 'Dự kiến ngày nhận hàng: nhận hàng từ ngày 7/7/2025 đến 10/7/2025'}</p><button className='w-60 text-gray-400 px-4 mr-4 py-2 rounded-md border border-gray-400'>Xác nhận đã nhận đơn hàng</button></>,
    DELIVERED: <><button className='w-60 text-gray-400 px-4 mr-4 py-2 rounded-md border border-gray-400'>Trả hàng/Hoàn tiền</button><button className='w-60 px-4 py-2 bg-black text-white rounded-md'>Đánh giá</button></>,
    CANCELLED: <><button className='w-60 px-4 py-2 bg-black text-white rounded-md'>Mua lại</button></>
  }
  useEffect(() => { getData() }, [activeStatus])
  const getData = async () => {
    try {
      setIsLoading(true)
      const res: any = await getAllOrderUserAction(activeStatus)
      if (res.status === 200 && res.orders) {
        setData(res.orders)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
      <div className="rounded-xl border-2 border-black dark:border-white">
        <div className="flex border-b border-black dark:border-white !box-border overflow-auto pt-2">
          {tabList.map((tab) => (
            <button
              key={tab.key}
              className={clsx(
                'whitespace-nowrap mx-4 h-full dark:text-white text-black py-2 text-sm font-medium transition-colors',
                activeStatus === tab.key
                && 'border-b-3 border-black dark:border-white'
              )}
              onClick={() => { setActiveStatus(tab.key); setData([]) }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="px-8 py-6">
          <div className='rounded-xl px-5 bg-gray-100'>
            <h3 className='border-b-2 h-11 flex items-center justify-end border-gray-300'>
              {tabList.find(tab => tab.key === activeStatus)?.label}
            </h3>
            <div>
              {isLoading && <div className="py-3 border-b-2 flex w-full justify-between h-24 items-center">
                <Skeleton className='h-16 w-full' />
              </div>}
              {!isLoading && data?.orderItems?.length > 0 && data.orderItems.map((item: any, index: number) => <OrderItem key={item.id} item={item} />)}

              {!isLoading && (!data?.orderItems || data.orderItems.length === 0) && (
                <p className="py-3 border-b-1 flex w-full h-16 items-center">Bạn chưa có đơn hàng nào cả</p>
              )}
            </div>
            <div className={clsx(
              'py-4',
              activeStatus === 'SHIPPED' ? 'flex justify-between' : 'text-end'
            )}>
              {btnByStatus[activeStatus]}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
