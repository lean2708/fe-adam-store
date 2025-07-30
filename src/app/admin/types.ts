// Admin panel types for React Admin
export type ThemeName = 'light' | 'dark';

// Product types for React Admin
export interface Product {
    id: number;
    name: string;
    description?: string;
    price?: number;
    isAvailable?: boolean;
    averageRating?: number;
    soldQuantity?: number;
    totalReviews?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;
    images?: Array<{
        id?: number;
        url?: string;
        altText?: string;
    }>;
    variants?: Array<{
        id?: number;
        price?: number;
        quantity?: number;
        isAvailable?: boolean;
        imageUrl?: string;
        status?: string;
        size?: {
            id?: number;
            name?: string;
        };
        color?: {
            id?: number;
            name?: string;
        };
    }>;
    // React Admin specific fields
    reference?: string; // For demo compatibility
    thumbnail?: string; // For demo compatibility
    width?: number; // For demo compatibility
    height?: number; // For demo compatibility
}

// Category types for React Admin
export interface Category {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    createdAt?: string;
    updatedAt?: string;
}

// User/Customer types for React Admin
export interface Customer {
    id: number;
    name: string;
    email: string;
    status?: 'ACTIVE' | 'INACTIVE';
    avatarUrl?: string;
    dob?: string;
    gender?: 'FEMALE' | 'MALE' | 'OTHER';
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
    roles?: Array<{
        id?: number;
        name?: string;
    }>;
    // React Admin demo compatibility
    first_name?: string;
    last_name?: string;
    avatar?: string;
    address?: {
        street?: string;
        city?: string;
        zipcode?: string;
    };
    groups?: string[];
    has_ordered?: boolean;
    latest_purchase?: string;
    has_newsletter?: boolean;
    nb_commands?: number;
    total_spent?: number;
}

// Order types for React Admin
export interface Order {
    id: number;
    orderCode?: string;
    totalAmount?: number;
    status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    shippingAddress?: string;
    createdAt?: string;
    updatedAt?: string;
    orderItems?: Array<{
        id?: number;
        productId?: number;
        productName?: string;
        quantity?: number;
        price?: number;
        totalPrice?: number;
    }>;
    // React Admin demo compatibility
    customer_id?: number;
    date?: string;
    total?: number;
    basket?: Array<{
        product_id: number;
        quantity: number;
    }>;
    returned?: boolean;
}

// Review types for React Admin
export interface Review {
    id: number;
    productId: number;
    productName?: string;
    customerId: number;
    customerName?: string;
    rating: number;
    comment?: string;
    createdAt?: string;
    updatedAt?: string;
    // React Admin demo compatibility
    customer_id?: number;
    product_id?: number;
    date?: string;
    status?: 'pending' | 'accepted' | 'rejected';
}

// Additional admin types
export interface Branch {
    id: number;
    name: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Color {
    id: number;
    name: string;
    hexCode?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Size {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Promotion {
    id: number;
    name: string;
    description?: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    permissions?: Permission[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Permission {
    id: number;
    name: string;
    description?: string;
    resource: string;
    action: string;
    createdAt?: string;
    updatedAt?: string;
}

// Legacy types for demo compatibility
export type Invoice = Order;
export interface BasketItem {
    product_id: number;
    quantity: number;
}

declare global {
    interface Window {
        restServer: any;
    }
}
