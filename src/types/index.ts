import { ImageBasic } from '@/api-client';
import { ORDER_STATUS, USER_ROLE } from '@/enums';

export type TCategory = {
  id: string;
  name: string;
  imageUrl: string;
  status?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TOrder = {
  OrderItems: TOrderItem[];
} & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: ORDER_STATUS | string;
  address: string;
  totalPrice: string;
  userId: string;
};

export type TOrderItem = {
  id: number;
  orderId: string;
  quantity: number;
  color: string;
  size: number;
  productId: string;
  Product: {
    id: string;
    title: string;
    price: string;
    description: string;
    colors: string[];
    sizes: number[];
    quantity: number;
    mainImage: string;
    images: string[];
    gender: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
export type TCartItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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

// Extended product type for admin table display with individual color/size combinations
export type TProductExpanded = TProduct & {
  variantId: number;
  price?: number;
  quantity?: number;
  variantStatus?: 'ACTIVE' | 'INACTIVE';
  variantIsAvailable?: boolean;
  color?: TEntityBasic;
  size?: TEntityBasic;
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

export type TAddress = {
  id?: number;
  isDefault: boolean;
  isVisible?: boolean;
  status?: string;
  phone?: string;
  streetDetail: string;
  ward: {
    code?: string;
    name: string;
  };
  district: {
    id?: number;
    name: string;
  };
  province: {
    id?: number;
    name: string;
  };
};
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
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
};

export type TSize = {
  id: number;
  name: string;
};

export type TPaymentHistory = {
  id: number;
  isPrimary?: boolean;
  paymentMethod?: string;
  totalAmount?: number;
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED';
  paymentTime?: string;
};

export type TPromotion = {
  id: number;
  code?: string;
  description?: string;
  discountPercent?: number;
  startDate?: string;
  endDate?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdBy?: string;
  createdAt?: string;
};

