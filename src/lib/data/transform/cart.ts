import type { CartItemResponse, EntityBasic } from "@/api-client/models";
import { TCartItem, TProduct, TColor } from "@/types";
import { fetchProductDetailByIdApi } from "../product";

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
 * Transform API CartItemResponse to TCartItem.
 * Prevent infinite recursion by not calling fetchProductDetailByIdApi if already called.
 */
export async function transformCartItemResponseToTCartItemWithProduct(apiCartItem: CartItemResponse, productOverride?: TProduct): Promise<TCartItem> {
    const variant = apiCartItem.productVariantBasic;
    // Only fetch product if not provided (prevents recursion)
    const product: TProduct | null = productOverride ?? (variant?.product?.id ? await fetchProductDetailByIdApi(variant.product.id) : null);

    // Build TColor[] for the product if available
    let colors: TColor[] | undefined = undefined;
    if (product && product.colors && Array.isArray(product.colors)) {
        colors = product.colors;
    }

    return {
        id: apiCartItem.id?.toString() ?? "",
        quantity: apiCartItem.quantity ?? 0,
        createdAt: new Date(), // Replace with actual date if available
        updatedAt: new Date(), // Replace with actual date if available
        color: variant?.color?.name ?? "",
        size: variant?.size?.name ?? "",
        productId: product?.id?.toString() ?? "",
        Product: product as TProduct,
        userId: "", // Replace with actual user ID if available from context
    };
}
