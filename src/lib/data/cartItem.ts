
import { TCartItem } from "@/types";
import { ControllerFactory } from "./factory-api-client";
import { transformCartItemResponseToTCartItemWithProduct } from "./transform/cart";

/**
 * Helper to get an instance of CartItemControllerApi with NextAuth using factory.
 */
async function getCartItemController() {
    return await ControllerFactory.getCartItemController();
}



/**
 * Fetch a cart item by its ID.
 */
export async function fetchCartItemByIdApi(id: number): Promise<TCartItem | null> {
    const api = await getCartItemController();
    const response = await api.fetchById6({ id });
    const item = response.data.result;
    if (!item) return null;
    // Pass product to avoid recursion if already fetched
    const variant = item.productVariantBasic;
    const product = variant?.product ?? null;
    return transformCartItemResponseToTCartItemWithProduct(item, product);
}

/**
 * Add a new cart item.
 */
export async function createCartItemApi(cartItemRequest: any): Promise<TCartItem | null> {
    const api = await getCartItemController();
    const response = await api.create2({cartItemRequest});
    const item = response.data.result;
    if (!item) return null;
    return transformCartItemResponseToTCartItemWithProduct(item);
}

/**
 * Update a cart item by its ID.
 */
export async function updateCartItemApi(id: number, cartItemUpdateRequest: any): Promise<TCartItem | null> {
    const api = await getCartItemController();
    const response = await api.update2({ id, cartItemUpdateRequest });
    const item = response.data.result;
    if (!item) return null;
    return transformCartItemResponseToTCartItemWithProduct(item);
}

/**
 * Delete a cart item by its ID.
 */
export async function deleteCartItemApi(id: number): Promise<boolean> {
    const api = await getCartItemController();
    const response = await api.delete1({ id });
    return response.data.code === 0;
}
