import { CartControllerApi } from "@/api-client";
import { getNextAuthConfiguration, getAuthenticatedAxiosInstance } from "@/lib/nextauth-config";
import type { CartItemResponse } from "@/api-client/models";
import { TCartItem } from "@/types";
import { fetchProductDetailByIdApi } from "./product";

// Define your app's cart item type


/**
 * Helper to get an instance of CartControllerApi with NextAuth config.
 */
async function getCartController() {
    const config = await getNextAuthConfiguration();
    const axiosInstance = await getAuthenticatedAxiosInstance();
    return new CartControllerApi(config, undefined, axiosInstance);
}

/**
 * Transform API CartItemResponse to TCartItem.
 */
export async function transformCartItemResponseToTCartItem(apiCartItem: CartItemResponse): Promise<TCartItem> {
    const variant = apiCartItem.productVariantBasic;
    const product = await fetchProductDetailByIdApi(variant?.product?.id ?? 0); // Assuming this function fetches product details by ID

    return {
        id: apiCartItem.id?.toString() ?? "",
        quantity: apiCartItem.quantity ?? 0,
        // price: apiCartItem.price ?? 0,
        createdAt: new Date(), // Replace with actual date if available
        updatedAt: new Date(), // Replace with actual date if available
        color: variant?.color?.name ?? "",
        size: variant?.size?.name ?? "", // Assuming size is represented by ID
        productId: product?.id?.toString() ?? "",
        Product: product,

        userId: "", // Replace with actual user ID if available from context
    };
}



/**
 * Fetch all cart items for current user (paginated).
 */
export async function fetchCartItemsApi(page?: number, size?: number, sort?: string[]): Promise<TCartItem[]> {
    const api = await getCartController();
    const response = await api.getCartItemsOfCurrentUser({ page, size, sort });
    // You may want to check response.data.code if your API uses it
    const items = response.data.result?.items ?? [];
    return Promise.all(items.map(transformCartItemResponseToTCartItem));
}
