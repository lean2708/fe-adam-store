import type {
    OrderResponse,
    OrderItemResponse,
    ProductVariantBasic,
    PageResponseOrderResponse,
} from "@/api-client/models";

import { ORDER_STATUS } from "@/enums";
import { TOrderItem, TOrder } from "@/types";
import { ActionResponse } from "@/lib/types/actions";

// Assuming you have a product fetching function






/**
 * Transforms API ProductVariantBasic to a simplified product object for TOrderItem.
 * This function likely needs to fetch full product details.
 */
async function transformProductVariantBasicToProduct(orderItemResponse: OrderItemResponse): Promise<TOrderItem['Product']> {
    return {
        id: orderItemResponse?.productVariant?.product?.id?.toString() ?? "",
        title: orderItemResponse?.productVariant?.product?.name ?? "Unknown Product",
        price: orderItemResponse?.unitPrice ?? 0,
        description: "",
        colors: [],
        sizes: [],
        quantity: 0,
        mainImage: "",
        images: [],
        gender: "",
        categoryId: "",
        createdAt: new Date(0),
        updatedAt: new Date(0),
    };
}

/**
 * Transforms API OrderItemResponse to TOrderItem.
 */
export async function transformOrderItemResponseToTOrderItem(apiOrderItem: OrderItemResponse): Promise<TOrderItem> {
    const productVariant = apiOrderItem.productVariant;
    const productData = productVariant ? await transformProductVariantBasicToProduct(apiOrderItem) : null;
    return {
        id: apiOrderItem.id ?? 0,
        orderId: "", // This will be set when transforming the full order
        quantity: apiOrderItem.quantity ?? 0,
        unitPrice: apiOrderItem.unitPrice ?? 0,
        color: productVariant?.color?.name ?? "N/A",
        size: productVariant?.size?.id ?? 0,
        productId: productData?.id ?? "",
        imageUrl: apiOrderItem.image?.imageUrl ?? "",
        Product: productData || {
            id: "",
            title: "N/A",
            price: 0,
            description: "",
            colors: [],
            sizes: [],
            quantity: 0,
            mainImage: "",
            images: [],
            gender: "",
            categoryId: "",
            createdAt: new Date(0),
            updatedAt: new Date(0),
        },
    };
}

/**
 * Safely transforms the API order status string to the ORDER_STATUS enum.
 * @param apiStatus The status from the API.
 * @returns A valid ORDER_STATUS or a default value.
 */
function transformApiStatusToOrderStatus(apiStatus?: OrderResponse['orderStatus']): ORDER_STATUS {
    // Using `any` for the includes check as TypeScript struggles with enum value types here.
    if (apiStatus && Object.values(ORDER_STATUS).includes(apiStatus as any)) {
        return apiStatus as any;
    }
    return ORDER_STATUS.PROCESSING; // Default status if status is unknown or not provided
}

/**
 * Transforms API OrderResponse to TOrder.
 */
export async function transformOrderResponseToTOrder(apiOrder: OrderResponse): Promise<TOrder> {
    const orderItemsPromises = (apiOrder.orderItems ?? []).map(transformOrderItemResponseToTOrderItem);
    const transformedOrderItems = await Promise.all(orderItemsPromises);

    // Update orderId for each item after transformation
    transformedOrderItems.forEach(item => {
        item.orderId = apiOrder.id?.toString() ?? "";
    });

    const address = apiOrder.address;

    return {
        OrderItems: transformedOrderItems,
        id: apiOrder.id || 0,
        customerPhone: apiOrder.address?.phone,
        createdAt: apiOrder.orderDate ? new Date(apiOrder.orderDate) : new Date(),
        updatedAt: apiOrder.orderDate ? new Date(apiOrder.orderDate) : new Date(),
        status: transformApiStatusToOrderStatus(apiOrder.orderStatus),
        userName: apiOrder.customerName ?? "Guest",
        address: [
            address?.streetDetail,
            address?.ward?.name,
            address?.district?.name,
            address?.province?.name
        ].filter(Boolean).join(", "),
        totalPrice: (apiOrder.totalPrice?.toString() ?? "0"),
        userId: "", // Populate from auth context or API if available
    };
}

/**
 * Transform array of OrderResponse to TOrder array
 */
export async function transformOrderArrayToTOrderArray(apiOrders: OrderResponse[]): Promise<TOrder[]> {
    const transformPromises = apiOrders.map(transformOrderResponseToTOrder);
    return Promise.all(transformPromises);
}

/**
 * Transform API page response to ActionResponse for orders
 */
export async function transformPageResponseOrderToActionResponse(
    apiResponse: PageResponseOrderResponse
): Promise<ActionResponse<TOrder[]>> {
    try {
        const transformedOrders = await transformOrderArrayToTOrderArray(apiResponse.items ?? []);

        return {
            success: true,
            actionSizeResponse: {
                size: apiResponse.size ?? 0,
                totalPages: apiResponse.totalPages ?? 0,
                totalItems: apiResponse.totalItems ?? 0// For
            },
            data: transformedOrders
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to transform orders",
        };
    }
}
