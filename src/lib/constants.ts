import { PAYMENT_METHODS } from '@/enums';
import { TPaymentMethodOption } from '@/types';
import { Truck } from 'lucide-react';

// *List of query keys for different API endpoints
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
export const DEFAULT_PAYMENT_METHODS: TPaymentMethodOption[] = [
  {
    id: 'cash',
    value: PAYMENT_METHODS.CASH,
    label: 'Thanh toán khi nhận hàng',
    icon: Truck,
    isAvailable: true,
  },
  {
    id: 'vnpay',
    value: PAYMENT_METHODS.VNPAY,
    label: 'Thanh toán qua VNPAY',
    image: '/imgs/vn-pay-logo.png',
    isAvailable: true,
  },
];

// *List of sizes
export const SIZE_LIST = [
  { name: 'XS', key: 'XS' },
  { name: 'S', key: 'S' },
  { name: 'M', key: 'M' },
  { name: 'L', key: 'L' },
  { name: 'XL', key: 'XL' },
  { name: 'XXL', key: 'XXL' },
];
