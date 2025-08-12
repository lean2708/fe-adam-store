import { ImageBasic } from '@/api-client';
import { ORDER_STATUS, USER_ROLE } from '@/enums';

export type TCategory = {
  id: string;
  title: string;
  image: string;
};


export type TCartItem = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  quantity: number;
  color: string;
  size: string;
  productId: string;
  Product: TProduct;
  userId: string;
};

export type TProduct = {
  title: string;
  mainImage: string;
  images?: ImageBasic[];
  id: number;
  minPrice: number;
  maxPrice: number;
  isAvailable?: boolean;
  name?: string;
  description?: string;
  averageRating?: number;
  soldQuantity?: number;
  totalReviews?: number;
  status?: string; // You can replace with enum if you have ProductResponseStatusEnum
  createdAt?: string;
  colors?: TColor[];
};

export type TReview = {
  id?: number;
  userName?: string;
  userAvatarUrl?: string;
  rating?: number;
  comment?: string;
  imageUrls?: object;
  createdAt?: string;
  updatedAt?: string;
};

export interface TProvince {
  id?: number;
  name?: string;
}

export interface TDistrict {
  id?: number;
  name?: string;
}

export interface TWard {
  code?: string;
  name?: string;
}

export interface TAddressItem {
  id: number;
  isDefault: boolean;
  isVisible: boolean;
  phone: string;
  status: string;
  streetDetail: string;
  province: TProvince;
  district: TDistrict;
  ward: TWard;
}
export interface TImage {
  id: number;
  imageUrl: string;
}



export interface TSize {
  id: number;
  name: string;
}


export interface ProductVariant {
  id: number;
  product: TProduct;
  color: TColor;
  size: TSize;
}

export interface TOrderItem {
  id: number;
  image: TImage;
  productVariant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export interface TOrder {
  id: number;
  customerName: string;
  discountAmount: number;
  orderDate: string;
  orderItems: TOrderItem[];
  orderStatus: string;
  totalPrice: number;
  address: TAddressItem;
}

export type TEntityBasic = {
  id?: number;
  name?: string;
};

export type TVariant = {
  id?: number;
  price?: number;
  quantity?: number;
  isAvailable?: boolean;
  imageUrl?: string;
  status?: string;
  size?: TEntityBasic;
};

export type TColor = {
  id: number;
  name: string;
  variants?: TVariant[];
};

export type TBranch = {
  id: string;
  name: string;
  location: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
};
