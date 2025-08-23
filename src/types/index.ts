import { ImageBasic } from '@/api-client';
import { ORDER_STATUS, PAYMENT_METHODS } from '@/enums';

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
  userName: string;
  customerName: string;
  discountAmount: number;
  orderDate: string;
  orderItems: TOrderItem[];
  orderStatus: string;
};

export type TOrderItem = {
  id: number;
  orderId: string;
  quantity: number;
  color: string;
  size: number;
  productId: string;
  imageUrl: string;
  image: TImage;
  productVariant: ProductVariant;
  unitPrice: number;
  isReview?: boolean;
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
  color: TEntityBasic;
  size: TEntityBasic;
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
  status?: string;
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

export interface Province {
  id?: number;
  name?: string;
}

export interface District {
  id?: number;
  name?: string;
}

export interface Ward {
  code?: string;
  name?: string;
}

export interface AddressItem {
  id?: number;
  isDefault?: boolean;
  isVisible?: boolean;
  phone?: string;
  status?: string;
  streetDetail?: string;
  province?: Province;
  district?: District;
  ward?: Ward;
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

export type TProductVariant = {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  isAvailable?: boolean;
  imageUrl?: string;
  status?: string;
  size?: TEntityBasic;
  color?: TEntityBasic;
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

export type TPaymentHistory = {
  id: number;
  isPrimary?: boolean;
  paymentMethod?: string;
  totalAmount?: number;
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELED' | 'FAILED';
  paymentTime?: string;
};

// Additional types for admin functionality
export type TUser = {
  id?: number;
  name?: string;
  email?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  dob?: string;
  gender?: 'FEMALE' | 'MALE' | 'OTHER';
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  roles?: Set<TEntityBasic>;
};

export type TRole = {
  id?: number;
  name?: string;
  description?: string;
};

export type TFile = {
  id?: number;
  fileName?: string;
  imageUrl?: string;
  createdBy?: string;
  createdAt?: string;
};

export type TConversation = {
  id?: string;
  type?: string;
  participantsHash?: string;
  conversationAvatar?: string;
  conversationName?: string;
  participants?: TParticipantInfo[];
  createdDate?: string;
  modifiedDate?: string;
};

export type TParticipantInfo = {
  userId?: number;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

export type TChatMessage = {
  id?: string;
  conversationId?: string;
  me?: boolean;
  message?: string;
  sender?: TParticipantInfo;
  createdDate?: string;
};

export type TTopSelling = {
  productId?: number;
  productName?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  soldQuantity?: number;
  totalRevenue?: number;
  imageUrl?: string;
};

export type TRevenueByMonth = {
  month?: number;
  year?: number;
  totalRevenue?: number;
};

// Request types for creating/updating entities
export type TProductRequest = {
  name: string;
  description: string;
  categoryId: number;
  imageIds: number[];
  variants: TVariantRequest[];
};

export type TVariantRequest = {
  colorId: number;
  sizeId: number;
  price: number;
  quantity: number;
};

export type TPromotionRequest = {
  code: string;
  description?: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
};

// Enums for order status
export enum SearchOrdersForAdminOrderStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum GetOrdersForUserOrderStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export type TPromotion = {
  id?: number;
  code?: string;
  description?: string;
  discountPercent?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdBy?: string;
  createdAt?: Date | string;
};

export type TShippingFee = {
  id?: number;
  address?: AddressItem;
  orderItem?: TOrderItem[];
  createdBy?: string;
  createdAt?: Date | string;
};

export interface TPaymentMethodOption {
  id: string;
  value: PAYMENT_METHODS;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  image?: string;
  isAvailable: boolean;
}
