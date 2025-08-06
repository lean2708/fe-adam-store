import { ImageBasic } from '@/api-client';
import { ORDER_STATUS, USER_ROLE } from '@/enums';

export type TCategory = {
  id: string;
  title: string;
  image: string;
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
  updatedAt?: string;
};
