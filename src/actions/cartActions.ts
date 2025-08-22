'use server';

import {
  createCartItemApi,
  updateCartItemApi,
  deleteCartItemApi,
} from '@/lib/data/cartItem';
import { fetchCartItemsApi } from '@/lib/data/cart';
import type { ActionResponse } from '@/lib/types/actions';
import { extractErrorMessage } from '@/lib/utils';
import { TCartItem } from '@/types';
import { CartItemRequest } from '@/api-client';

/**
 * Fetch all cart items for the current user (paginated).
 */
export async function fetchCartItemsAction(
  userId: number,
  page?: number,
  size?: number,
  sort?: string[]
): Promise<ActionResponse<TCartItem[]>> {
  try {
    const items = await fetchCartItemsApi(userId, page, size, sort);
    return { success: true, data: items };
  } catch (error) {
    const extracted = extractErrorMessage(error, 'Failed to fetch cart items.');
    return { success: false, message: extracted.message, apiError: extracted };
  }
}

/**
 * Add a new cart item using API.
 */
export async function addToCartAction(
  cartItemRequest: CartItemRequest,
  userId: number
) {
  try {
    // The API expects a cartItemRequest object

    const item = await createCartItemApi(cartItemRequest, userId);
    return {
      success: true,
      status: 200,
      message: 'New product added in your cart',
      cartItem: item,
    };
  } catch (error) {
    const extracted = extractErrorMessage(error, 'Failed to add cart item.');
    return { success: false, message: extracted.message, apiError: extracted };
  }
}

export async function deleteCartItemAction(cartItemId: string, userId: number) {
  try {
    await deleteCartItemApi(Number(cartItemId));
    const items = await fetchCartItemsApi(userId);
    return {
      status: 202,
      success: true,
      message: 'Cart item deleted',
      cart: items,
    };
  } catch (error) {
    const extracted = extractErrorMessage(error, 'Failed to delete cart item.');
    return { success: false, message: extracted.message, apiError: extracted };
  }
}

export async function deleteAllCartItemsAction(userId: string) {
  try {
    // No bulk delete in API, so fetch all and delete one by one
    const items = await fetchCartItemsApi(Number(userId));
    const userItems = items.filter((item) => item.userId === userId);
    console.log(items);
    await Promise.all(
      userItems.map((item) => deleteCartItemApi(Number(item.id)))
    );
    return {
      status: 204,
      success: true,
      message: 'The shopping cart is empty',
    };
  } catch (error) {
    const extracted = extractErrorMessage(
      error,
      'Xóa vật phẩm trong giỏ hàng thất bại'
    );
    return {
      success: false,
      message: extracted.message,
      apiError: extracted,
    };
  }
}

export async function changeCartItemVariantAction(
  userId: number,
  cartItemId: string,
  colorId: number,
  sizeId: number,
  quantity?: number
) {
  try {
    const cartItemUpdateRequest = { sizeId, colorId, quantity };

    const item = await updateCartItemApi(
      userId,
      Number(cartItemId),
      cartItemUpdateRequest
    );

    // const items = await fetchCartItemsApi();
    return {
      status: 202,
      success: true,
      cart: item,
      message: 'Thay đổi sản phẩm thành công',
    };
  } catch (error) {
    const extracted = extractErrorMessage(error, 'Cập nhật giỏ hàng thất bại');
    return {
      success: false,
      message: extracted.message,
      apiError: extracted,
    };
  }
}

export async function checkoutAction(address: string) {
  // Not implemented: No checkout/order API in cartItem.ts or cart.ts
  return { status: 501, message: 'Checkout API not implemented' };
}

// export async function getCart(userId: string) {
//   // Just fetch all items for the current user
//   try {
//     const items = await fetchCartItemsApi();
//     return items.filter((item) => item.userId === userId);
//   } catch (error) {
//     return [];
//   }
// }
