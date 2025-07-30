// Transform functions to map API responses to React Admin types

import {
    ProductResponse,
    CategoryResponse,
    UserResponse,
    OrderResponse,
    ReviewResponse,
    BranchResponse,
    ColorResponse,
    SizeResponse,
    PromotionResponse,
    RoleResponse,
    PermissionResponse,
    ImageBasic,
    ProductVariantResponse,
    EntityBasic
} from '@/api-client';

import {
    Product,
    Category,
    Customer,
    Order,
    Review,
    Branch,
    Color,
    Size,
    Promotion,
    Role,
    Permission
} from './types';

// Transform Product API response to React Admin Product
export function transformProductToReactAdmin(apiProduct: ProductResponse): Product {
    return {
        id: apiProduct.id || 0,
        name: apiProduct.name || '',
        description: apiProduct.description || undefined,
        price: apiProduct.variants?.[0]?.price || 0,
        isAvailable: apiProduct.isAvailable ?? true,
        averageRating: apiProduct.averageRating || 0,
        soldQuantity: apiProduct.soldQuantity || 0,
        totalReviews: apiProduct.totalReviews || 0,
        status: apiProduct.status || 'ACTIVE',
        createdAt: apiProduct.createdAt || undefined,
        images: apiProduct.images?.map((img: ImageBasic) => ({
            id: img.id,
            url: (img as any).url || '',
            altText: (img as any).altText || ''
        })) || [],
        variants: apiProduct.variants?.map((variant: ProductVariantResponse) => ({
            id: variant.id,
            price: variant.price,
            quantity: variant.quantity,
            isAvailable: variant.isAvailable,
            imageUrl: (variant as any).imageUrl || '',
            status: variant.status,
            size: variant.size ? {
                id: variant.size.id,
                name: variant.size.name
            } : undefined,
            color: variant.color ? {
                id: variant.color.id,
                name: variant.color.name
            } : undefined
        })) || [],
        // React Admin demo compatibility
        reference: `${apiProduct.name || 'Product'}-${apiProduct.id}`,
        thumbnail: (apiProduct.images?.[0] as any)?.url || '/placeholder-image.jpg',
        width: 300,
        height: 300
    };
}

// Transform Category API response to React Admin Category
export function transformCategoryToReactAdmin(apiCategory: CategoryResponse): Category {
    return {
        id: apiCategory.id || 0,
        name: apiCategory.name || '',
        description: (apiCategory as any).description || undefined,
        parentId: (apiCategory as any).parentId || undefined,
        createdAt: apiCategory.createdAt || undefined,
        updatedAt: (apiCategory as any).updatedAt || undefined,
    };
}

// Transform User API response to React Admin Customer
export function transformUserToReactAdmin(apiUser: UserResponse): Customer {
    // Safety check
    if (!apiUser) {
        return {
            id: 0,
            name: 'Unknown User',
            email: '',
            status: 'ACTIVE',
            first_name: 'Unknown',
            last_name: 'User',
            avatar: undefined,
            address: { street: '', city: '', zipcode: '' },
            groups: [],
            has_ordered: false,
            latest_purchase: new Date().toISOString(),
            has_newsletter: false,
            nb_commands: 0,
            total_spent: 0
        };
    }

    const nameParts = (apiUser.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
        id: apiUser.id || 0,
        name: apiUser.name || '',
        email: apiUser.email || '',
        status: apiUser.status || 'ACTIVE',
        avatarUrl: apiUser.avatarUrl || undefined,
        dob: apiUser.dob || undefined,
        gender: apiUser.gender || undefined,
        createdBy: apiUser.createdBy || undefined,
        updatedBy: apiUser.updatedBy || undefined,
        createdAt: apiUser.createdAt || undefined,
        updatedAt: apiUser.updatedAt || undefined,
        roles: apiUser.roles ? Array.from(apiUser.roles).map((role: EntityBasic) => ({
            id: role.id || 0,
            name: role.name || ''
        })) : [],
        // React Admin demo compatibility
        first_name: firstName,
        last_name: lastName,
        avatar: apiUser.avatarUrl,
        address: {
            street: '',
            city: '',
            zipcode: ''
        },
        groups: [],
        has_ordered: true,
        latest_purchase: apiUser.createdAt || new Date().toISOString(),
        has_newsletter: false,
        nb_commands: 0,
        total_spent: 0
    };
}

// Transform Order API response to React Admin Order
export function transformOrderToReactAdmin(apiOrder: OrderResponse): Order {
    return {
        id: apiOrder.id || 0,
        orderCode: (apiOrder as any).orderCode || '',
        totalAmount: (apiOrder as any).totalAmount || 0,
        status: ((apiOrder as any).status as Order['status']) || 'PENDING',
        customerName: apiOrder.customerName || undefined,
        customerPhone: (apiOrder as any).customerPhone || undefined,
        customerEmail: (apiOrder as any).customerEmail || undefined,
        shippingAddress: (apiOrder as any).shippingAddress || undefined,
        createdAt: (apiOrder as any).createdAt || undefined,
        updatedAt: (apiOrder as any).updatedAt || undefined,
        orderItems: (apiOrder as any).orderItems?.map((item: any) => ({
            id: item.id || 0,
            productId: item.productId || 0,
            productName: item.productName || '',
            quantity: item.quantity || 0,
            price: item.price || 0,
            totalPrice: item.totalPrice || 0,
        })) || [],
        // React Admin demo compatibility
        customer_id: (apiOrder as any).customerId || 0,
        date: (apiOrder as any).createdAt || new Date().toISOString(),
        total: (apiOrder as any).totalAmount || 0,
        basket: (apiOrder as any).orderItems?.map((item: any) => ({
            product_id: item.productId || 0,
            quantity: item.quantity || 0
        })) || [],
        returned: false
    };
}

// Transform Review API response to React Admin Review
export function transformReviewToReactAdmin(apiReview: ReviewResponse): Review {
    return {
        id: apiReview.id || 0,
        productId: (apiReview as any).productId || 0,
        productName: (apiReview as any).productName || undefined,
        customerId: (apiReview as any).customerId || 0,
        customerName: (apiReview as any).customerName || undefined,
        rating: apiReview.rating || 0,
        comment: apiReview.comment || undefined,
        createdAt: apiReview.createdAt || undefined,
        updatedAt: (apiReview as any).updatedAt || undefined,
        // React Admin demo compatibility
        customer_id: (apiReview as any).customerId || 0,
        product_id: (apiReview as any).productId || 0,
        date: apiReview.createdAt || new Date().toISOString(),
        status: 'accepted'
    };
}

// Transform Branch API response to React Admin Branch
export function transformBranchToReactAdmin(apiBranch: BranchResponse): Branch {
    return {
        id: apiBranch.id || 0,
        name: apiBranch.name || '',
        address: (apiBranch as any).address || undefined,
        phoneNumber: (apiBranch as any).phoneNumber || undefined,
        email: (apiBranch as any).email || undefined,
        isActive: (apiBranch as any).isActive ?? true,
        createdAt: (apiBranch as any).createdAt || undefined,
        updatedAt: (apiBranch as any).updatedAt || undefined,
    };
}

// Transform Color API response to React Admin Color
export function transformColorToReactAdmin(apiColor: ColorResponse): Color {
    return {
        id: apiColor.id || 0,
        name: apiColor.name || '',
        hexCode: (apiColor as any).hexCode || undefined,
        createdAt: (apiColor as any).createdAt || undefined,
        updatedAt: (apiColor as any).updatedAt || undefined,
    };
}

// Transform Size API response to React Admin Size
export function transformSizeToReactAdmin(apiSize: SizeResponse): Size {
    return {
        id: apiSize.id || 0,
        name: apiSize.name || '',
        description: (apiSize as any).description || undefined,
        createdAt: (apiSize as any).createdAt || undefined,
        updatedAt: (apiSize as any).updatedAt || undefined,
    };
}

// Transform Promotion API response to React Admin Promotion
export function transformPromotionToReactAdmin(apiPromotion: PromotionResponse): Promotion {
    return {
        id: apiPromotion.id || 0,
        name: (apiPromotion as any).name || '',
        description: apiPromotion.description || undefined,
        discountPercentage: apiPromotion.discountPercent || 0,
        startDate: apiPromotion.startDate || '',
        endDate: apiPromotion.endDate || '',
        isActive: (apiPromotion as any).isActive ?? true,
        createdAt: (apiPromotion as any).createdAt || undefined,
        updatedAt: (apiPromotion as any).updatedAt || undefined,
    };
}

// Transform Role API response to React Admin Role
export function transformRoleToReactAdmin(apiRole: RoleResponse): Role {
    return {
        id: apiRole.id || 0,
        name: apiRole.name || '',
        description: apiRole.description || undefined,
        permissions: (apiRole as any).permissions?.map(transformPermissionToReactAdmin) || [],
        createdAt: (apiRole as any).createdAt || undefined,
        updatedAt: (apiRole as any).updatedAt || undefined,
    };
}

// Transform Permission API response to React Admin Permission
export function transformPermissionToReactAdmin(apiPermission: PermissionResponse): Permission {
    return {
        id: apiPermission.id || 0,
        name: apiPermission.name || '',
        description: (apiPermission as any).description || undefined,
        resource: (apiPermission as any).resource || '',
        action: (apiPermission as any).action || '',
        createdAt: (apiPermission as any).createdAt || undefined,
        updatedAt: (apiPermission as any).updatedAt || undefined,
    };
}

// Generic transform function that routes to specific transformers
export function transformToReactAdmin(resource: string, apiResponse: any): any {
    // Safety check: ensure apiResponse exists
    if (!apiResponse) {
        console.warn(`No API response provided for resource: ${resource}`);
        return {
            id: Math.random(),
            name: `Empty ${resource}`,
        };
    }

    try {
        switch (resource) {
            case 'products':
                return transformProductToReactAdmin(apiResponse);
            case 'categories':
                return transformCategoryToReactAdmin(apiResponse);
            case 'users':
            case 'customers':
                return transformUserToReactAdmin(apiResponse);
            case 'orders':
            case 'invoices':
                return transformOrderToReactAdmin(apiResponse);
            case 'reviews':
                return transformReviewToReactAdmin(apiResponse);
            case 'branches':
                return transformBranchToReactAdmin(apiResponse);
            case 'colors':
                return transformColorToReactAdmin(apiResponse);
            case 'sizes':
                return transformSizeToReactAdmin(apiResponse);
            case 'promotions':
                return transformPromotionToReactAdmin(apiResponse);
            case 'roles':
                return transformRoleToReactAdmin(apiResponse);
            case 'permissions':
                return transformPermissionToReactAdmin(apiResponse);
            default:
                // Fallback: ensure id field exists
                return {
                    id: apiResponse.id || apiResponse.productId || apiResponse.categoryId || Math.random(),
                    name: apiResponse.name || `${resource} item`,
                    ...apiResponse
                };
        }
    } catch (error) {
        console.error(`Error transforming ${resource}:`, error, 'API Response:', apiResponse);
        // Return a safe fallback
        return {
            id: apiResponse.id || Math.random(),
            name: apiResponse.name || `${resource} item`,
            ...apiResponse
        };
    }
}
