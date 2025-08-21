'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle } from 'lucide-react';
import { vnPayCallbackAction } from '@/actions/orderActions';
import { toast } from 'sonner';

type Props = {};

const AnnouncementVnPayModal = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{
    orderId: string;
    isSuccess: boolean;
  } | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  //   const t = useTranslations('OrderStatus');

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const requestCode = searchParams.get('vnp_ResponseCode');

    if (!orderId || !requestCode) {
      return;
    }

    const fetchPayCallBack = async () => {
      try {
        const prepareData = {
          orderId: Number(orderId),
          responseCode: requestCode,
        };

        const res = await vnPayCallbackAction(prepareData);

        if (res.success) {
          setOrderStatus({
            orderId: orderId,
            isSuccess: requestCode === '00',
          });
          setIsOpen(true);
        }
      } catch (error) {
        toast.error(`Error processing VNPay callback: ${error}`);
        setOrderStatus({
          orderId: orderId,
          isSuccess: false,
        });
        setIsOpen(true);
      }
    };

    fetchPayCallBack();
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    setOrderStatus(null);

    // Clean up URL parameters
    const url = new URL(window.location.href);
    url.search = '';
    router.replace(url.pathname, { scroll: false });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='max-w-md'>
        <AlertDialogHeader>
          <div className='flex flex-col items-center text-center'>
            {/* Icon */}
            <div className='mb-4'>
              {orderStatus?.isSuccess ? (
                <div className='mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100'>
                  <CheckCircle className='w-6 h-6 text-green-600' />
                </div>
              ) : (
                <div className='mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100'>
                  <XCircle className='w-6 h-6 text-red-600' />
                </div>
              )}
            </div>

            {/* Title */}
            <AlertDialogTitle className='text-lg font-semibold mb-2'>
              {/* {orderStatus?.isSuccess ? t('success.title') : t('failure.title')} */}
              {orderStatus?.isSuccess
                ? 'Thanh toán thành công'
                : 'Thanh toán thất bại'}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        {/* Content */}
        <div className='text-center space-y-4'>
          <AlertDialogDescription className='text-muted-foreground'>
            {/* {orderStatus?.isSuccess
              ? t('success.message')
              : t('failure.message')} */}
            {orderStatus?.isSuccess
              ? 'Bạn đã thanh toán bằng VN pay thành công, vui lòng kiểm tra đơn hàng trong mục orders'
              : 'Bạn đã thanh toán bằng VN pay thất bại, vui lòng kiểm tra đơn hàng trong mục orders'}
          </AlertDialogDescription>

          {/* Order ID Display */}
          {orderStatus && (
            <div className='bg-muted rounded-lg p-3'>
              <p className='text-sm text-muted-foreground mb-1'>
                {/* {t('orderId')} */}
                mã orderID:
              </p>
              <p className='font-mono text-sm font-medium'>
                {orderStatus.orderId}
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter className='flex justify-center'>
          <AlertDialogAction
            onClick={() => router.push('/orders')}
            className={`px-6 py-3 rounded-full font-medium transition-colors  `}
          >
            {/* {t('close')} */}
            Go to My Orders
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleClose}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              orderStatus?.isSuccess
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {/* {t('close')} */}
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AnnouncementVnPayModal;
