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
async function transformProductVariantBasicToProduct(variant: ProductVariantBasic): Promise<TOrderItem['Product']> {
    return {
        id: variant?.product?.id?.toString() ?? "",
        title: variant?.product?.name ?? "Unknown Product",
        price: "0",
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
    const productData = productVariant ? await transformProductVariantBasicToProduct(productVariant) : null;

    return {
        id: apiOrderItem.id ?? 0,
        orderId: "", // This will be set when transforming the full order
        quantity: apiOrderItem.quantity ?? 0,
        // unitPrice: apiOrderItem.unitPrice ?? 0,
        color: productVariant?.color?.name ?? "N/A",
        size: productVariant?.size?.id ?? 0,
        productId: productData?.id ?? "",
        imageUrl: apiOrderItem.image?.imageUrl ?? "",
        Product: productData || {
            id: "",
            title: "N/A",
            price: "0",
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
        id: apiOrder.id?.toString() ?? "",
        createdAt: apiOrder.orderDate ? new Date(apiOrder.orderDate) : new Date(),
        updatedAt: apiOrder.orderDate ? new Date(apiOrder.orderDate) : new Date(),
        status: apiOrder.orderStatus ? (apiOrder.orderStatus as unknown as ORDER_STATUS) : ORDER_STATUS.PROGRESS, // Cast to your enum, provide default
        userName: apiOrder.customerName ?? "Guest",
        // customerName: apiOrder.customerName ?? "Guest",
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
): Promise<ActionResponse<{ items: TOrder[], totalItems: number, totalPages: number }>> {
    try {
        const transformedOrders = await transformOrderArrayToTOrderArray(apiResponse.items ?? []);

        return {
            success: true,
            data: {
                items: transformedOrders,
                totalItems: apiResponse.totalItems ?? 0,
                totalPages: apiResponse.totalPages ?? 0
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to transform orders",
        };
    }
}
