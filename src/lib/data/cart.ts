import { TCartItem } from '@/types';
import { ControllerFactory } from './factory-api-client';
import { transformCartItemResponseToTCartItem } from './transform/cart';

// Define your app's cart item type

/**
 * Helper to get an instance of CartControllerApi with NextAuth using factory.
 */
async function getCartController() {
  return await ControllerFactory.getCartController();
}

/**
 * Fetch all cart items for current user (paginated).
 */
export async function fetchCartItemsApi(
  userId: number,
  page?: number,
  size?: number,
  sort?: string[]
): Promise<TCartItem[]> {
  const api = await getCartController();
  const response = await api.getCartItemsOfCurrentUser({ page, size, sort });
  // You may want to check response.data.code if your API uses it
  const items = response.data.result?.items ?? [];
  const TCartItem = Promise.all(
    items.map(transformCartItemResponseToTCartItem)
  );
  TCartItem.then((items) =>
    items.map((item) => (item.userId = userId.toString() ?? ''))
  );
  return TCartItem;
}
