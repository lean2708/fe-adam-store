import { OrderControllerApi, OrderControllerApiCalculateShippingFeeRequest, OrderControllerApiCreate1Request, OrderControllerApiPayCallbackHandlerRequest, OrderControllerApiUpdateAddressRequest } from "@/api-client"; // Adjust path as needed
import { getAuthenticatedAxiosInstance } from "@/lib/auth/axios-config";
import type {
    OrderResponse,
    OrderItemResponse,
    ProductVariantBasic,
    // Import all necessary request and response types from your API client
    ApiResponseShippingFeeResponse,
    ApiResponseOrderResponse,
    // Assuming these are also generated or available
    // RawAxiosRequestConfig // You might need this if using axios directly
} from "@/api-client/models"; // Adjust path as needed for models
import { fetchProductDetailByIdApi } from "../product";
import { ORDER_STATUS } from "@/enums";
import { TOrderItem, TOrder } from "@/types";
import type { ApiResponseVNPayResponse } from "@/api-client/models"; // Add this import if not already present

// Assuming you have a product fetching function

/**
 * Helper to get an instance of OrderControllerApi with NextAuth.
 */
async function getOrderController() {
    const axiosInstance = await getAuthenticatedAxiosInstance();
    return new OrderControllerApi(undefined, undefined, axiosInstance);
}






/**
 * Transforms API ProductVariantBasic to a simplified product object for TOrderItem.
 * This function likely needs to fetch full product details.
 */
async function transformProductVariantBasicToProduct(variant: ProductVariantBasic): Promise<TOrderItem['Product']> {
    const productId = variant?.product?.id ?? 0;
    const productDetail = await fetchProductDetailByIdApi(productId); // Fetches a more detailed product

    // return {
    //     id: productDetail?.id?.toString() ?? "",
    //     title: productDetail?.title ?? "Unknown Product",
    //     price: productDetail?.price?.toString() ?? "0",
    //     description: productDetail?.description ?? "",
    //     colors: productDetail?.colors ?? [],
    //     sizes: productDetail?.sizes ?? [],
    //     quantity: productDetail?.quantity ?? 0,
    //     mainImage: productDetail?.mainImage ?? "",
    //     images: productDetail?.images ?? [],
    //     gender: productDetail?.gender ?? "",
    //     categoryId: productDetail?.categoryId?.toString?.() ?? "",
    //     createdAt: productDetail?.createdAt ? new Date(productDetail.createdAt) : new Date(0),
    //     updatedAt: productDetail?.updatedAt ? new Date(productDetail.updatedAt) : new Date(0),
    // };
    return {
        id: "",
        title: "Unknown Product",
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
        id: apiOrderItem.id?.toString() ?? "",
        orderId: "", // This will be set when transforming the full order
        quantity: apiOrderItem.quantity ?? 0,
        // unitPrice: apiOrderItem.unitPrice ?? 0,
        color: productVariant?.color?.name ?? "N/A",
        size: productVariant?.size?.id ?? 0,
        productId: productData?.id ?? "",
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
