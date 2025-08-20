'use client';

import { fetchCartItemsAction } from '@/actions/cartActions';
import type { TCartItem } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type State = {
  cartItems: TCartItem[];
  status: 'idle' | 'loading' | 'success' | 'error';
  // total of all items in cart
  totalPrice: string;
  // selected cart item ids
  selectedItems: number[];
  // total price of selected items only
  selectedTotalPrice: number;
  // Cache timestamp to track when cart was last fetched
  lastFetched: number | null;
  // Cache duration in milliseconds (5 minutes)
  cacheTimeout: number;
};

export type Actions = {
  fetchCart: (userId: number, forceRefresh?: boolean) => Promise<void>;
  setCartItems: (cartItems: TCartItem[]) => void;
  toggleItemSelection: (id: number) => void;
  toggleAllItems: (select: boolean) => void;
  updateCartItem: (itemId: string, newData: Partial<TCartItem>) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  isCartFresh: () => boolean;
};

// Resolve unit price for a cart item with fallbacks
const resolveUnitPrice = (item: TCartItem): number => {
  // Prefer variant/price if they exist on cart item (client-chosen)
  // @ts-ignore optional fields depending on your TCartItem; safe to read
  const direct = item.variant?.price ?? (item as any).price;
  if (typeof direct === 'number') return direct;

  // Try to locate chosen variant by color/size in Product
  const color = item.Product?.colors?.find((c) => c.name === item.color.name);
  const variant = color?.variants?.find((v) => v.size?.name === item.size.name);
  if (typeof variant?.price === 'number') return variant.price;

  // Fallback to first variant of first color
  const fallback = item.Product?.colors?.[0]?.variants?.[0]?.price;
  return Number(fallback ?? 0);
};

const lineTotal = (item: TCartItem): number =>
  item.quantity * resolveUnitPrice(item);
const sumAll = (items: TCartItem[]): number =>
  items.reduce((s, it) => s + lineTotal(it), 0);
const sumSelected = (items: TCartItem[], selected: number[]): number =>
  items.reduce(
    (s, it) => (selected.includes(Number(it.id)) ? s + lineTotal(it) : s),
    0
  );

const formatMoney = (n: number): string => n.toFixed(2);

// Áp dụng persist cho store - lưu các field cần thiết
export const useCartStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      cartItems: [],
      totalPrice: '0',
      selectedItems: [],
      selectedTotalPrice: 0,
      status: 'idle',
      lastFetched: null,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes

      // Check if cart data is still fresh
      isCartFresh: () => {
        const state = get();
        if (!state.lastFetched) return false;
        return Date.now() - state.lastFetched < state.cacheTimeout;
      },

      // Load cart from server with caching logic
      fetchCart: async (userId: number, forceRefresh = false) => {
        const state = get();

        // Skip fetch if data is fresh and not forcing refresh
        if (
          !forceRefresh &&
          state.isCartFresh() &&
          state.cartItems.length > 0
        ) {
          if (state.status !== 'success') {
            set({ status: 'success' });
          }
        }

        set({ status: 'loading' });
        try {
          const response = await fetchCartItemsAction(userId, 0, 10, [
            'id,desc',
          ]);
          const items: TCartItem[] =
            (response && response.success ? response.data : []) ?? [];

          // Reconcile selected ids with fresh items
          set((state) => {
            const total = sumAll(items);
            const validSelected = state.selectedItems.filter((sid) =>
              items.some((it) => Number(it.id) === sid)
            );
            const selectedTotal = sumSelected(items, validSelected);

            return {
              cartItems: items,
              totalPrice: formatMoney(total),
              selectedItems: validSelected,
              selectedTotalPrice: selectedTotal,
              status: 'success',
              lastFetched: Date.now(),
            };
          });
        } catch {
          set({ status: 'error' });
        }
      },

      // Replace cart items and recompute totals (also reconcile selection)
      setCartItems: (cartItems) =>
        set((state) => {
          console.log('cartItems', cartItems);

          // Merge new items with existing ones, updating if exists, adding if new
          const mergedItems = [...state.cartItems];

          cartItems.forEach((newItem) => {
            const existingIndex = mergedItems.findIndex(
              (item) => item.id === newItem.id
            );
            if (existingIndex >= 0) {
              // Update existing item
              mergedItems[existingIndex] = {
                ...mergedItems[existingIndex],
                ...newItem,
              };
            } else {
              // Add new item
              mergedItems.push(newItem);
            }
          });

          const total = sumAll(mergedItems);
          const validSelected = state.selectedItems.filter((sid) =>
            mergedItems.some((it) => Number(it.id) === sid)
          );
          const selectedTotal = sumSelected(mergedItems, validSelected);

          return {
            cartItems: mergedItems,
            totalPrice: formatMoney(total),
            selectedItems: validSelected,
            selectedTotalPrice: selectedTotal,
            lastFetched: Date.now(),
          };
        }),

      // Update a single item and recompute totals
      updateCartItem: (itemId, newData) =>
        set((state) => {
          const updatedCartItems = state.cartItems.map((item) =>
            item.id === itemId ? { ...item, ...newData } : item
          );

          const total = sumAll(updatedCartItems);
          const selectedTotal = sumSelected(
            updatedCartItems,
            state.selectedItems
          );

          return {
            cartItems: updatedCartItems,
            totalPrice: formatMoney(total),
            selectedTotalPrice: selectedTotal,
            lastFetched: Date.now(),
          };
        }),

      // Remove an item, update selection, recompute totals
      removeCartItem: (id) =>
        set((state) => {
          const updatedItems = state.cartItems.filter((ci) => ci.id !== id);
          const updatedSelected = state.selectedItems.filter(
            (sid) => sid !== Number(id)
          );

          const total = sumAll(updatedItems);
          const selectedTotal = sumSelected(updatedItems, updatedSelected);

          return {
            cartItems: updatedItems,
            totalPrice: formatMoney(total),
            selectedItems: updatedSelected,
            selectedTotalPrice: selectedTotal,
            lastFetched: Date.now(),
          };
        }),

      // Clear everything including cache
      clearCart: () =>
        set(() => {
          useCartStore.persist.clearStorage();

          return {
            cartItems: [],
            totalPrice: '0',
            selectedItems: [],
            selectedTotalPrice: 0,
            status: 'idle',
            lastFetched: null,
          };
        }),

      // Toggle one item selection and recompute selected total
      toggleItemSelection: (id) =>
        set((state) => {
          const selectedItems = state.selectedItems.includes(id)
            ? state.selectedItems.filter((x) => x !== id)
            : [...state.selectedItems, id];

          const selectedTotalPrice = sumSelected(
            state.cartItems,
            selectedItems
          );
          return { selectedItems, selectedTotalPrice };
        }),

      // Select/Deselect all; when selecting all, selectedTotalPrice equals total of all items
      toggleAllItems: (select) =>
        set((state) => {
          if (select) {
            const allIds = state.cartItems.map((item) => Number(item.id));
            const selectedTotalPrice = sumAll(state.cartItems);
            return { selectedItems: allIds, selectedTotalPrice };
          }
          return { selectedItems: [], selectedTotalPrice: 0 };
        }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        selectedItems: state.selectedItems,
        // cartItems: state.cartItems,
        lastFetched: state.lastFetched,
        // totalPrice: state.totalPrice,
        // selectedTotalPrice: state.selectedTotalPrice,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
