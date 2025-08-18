import { TPaymentMethodOption } from '@/types';
import { Truck } from 'lucide-react';

export const QUERY_KEY_ADDRESS = {
  LIST: 'user-address-list',
  PROVINCES: 'provinces',
  DISTRICTS: 'districts',
  WARDS: 'wards',
};

export const QUERY_KEY_PROMOTION = {
  LIST: 'user-promotion-list',
};

export const QUERY_KEY_ORDER_PRODUCT_VARIANT = {
  LIST: 'product-variant-list',
};

export const QUERY_KEY_ORDER_FEE = {
  SHIPPING_FEE: 'shipping-fee',
};

// *List of payment methods ( can use icon or image)
export const PAYMENT_METHODS: TPaymentMethodOption[] = [
  {
    id: 'cod',
    value: 'cod',
    label: 'Thanh toán khi nhận hàng',
    icon: Truck,
  },
  {
    id: 'vnpay',
    value: 'vnpay',
    label: 'Thanh toán qua VNPAY',
    image: '/imgs/vn-pay-logo.png',
  },
];
