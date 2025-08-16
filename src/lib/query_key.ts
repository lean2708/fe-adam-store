import { TCartItem } from '@/types';
import {
  QUERY_KEY_ADDRESS,
  QUERY_KEY_ORDER_PRODUCT_VARIANT,
} from './constants';

export const addressKeys = {
  all: [QUERY_KEY_ADDRESS.LIST],
  districts: (provinceId: number | null) => [
    QUERY_KEY_ADDRESS.DISTRICTS,
    provinceId,
  ],
  wards: (districtId: number | null) => [QUERY_KEY_ADDRESS.WARDS, districtId],
};

export const orderProductVariantKeys = {
  all: [QUERY_KEY_ORDER_PRODUCT_VARIANT.LIST],
  productVariants: (selectedItems: TCartItem[]) => [
    QUERY_KEY_ORDER_PRODUCT_VARIANT.LIST,
    selectedItems
      .map((item) => `${item.Product.id}-${item.color.id}-${item.size.id}`)
      .join(','),
    ,
  ],
};
