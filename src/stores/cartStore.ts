'use client';

import { fetchCartItemsAction } from '@/actions/cartActions';
import type { TCartItem } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type State = {
  cartItems: TCartItem[];
  orderSelectedItems: TCartItem[];
  status: 'idle' | 'loading' | 'success' | 'error';
  // total of all items in cart
  totalPrice: string;
  // selected cart item ids
  selectedItems: number[];
  // total price of selected items only
  selectedTotalPrice: number;
};

export type Actions = {
  fetchCart: (userId: number) => Promise<void>;
  setCartItems: (cartItems: TCartItem[]) => void;
  setOrderSelectedItems: (items: TCartItem[]) => void;
  toggleItemSelection: (id: number) => void;
  toggleAllItems: (select: boolean) => void;
  updateCartItem: (itemId: string, newData: Partial<TCartItem>) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
};

// Resolve unit price for a cart item with fallbacks
const resolveUnitPrice = (item: TCartItem): number => {
  // Prefer variant/price if they exist on cart item (client-chosen)
  // @ts-ignore optional fields depending on your TCartItem; safe to read
  const direct = item.variant?.price ?? (item as any).price;
  if (typeof direct === 'number') return direct;

  // Try to locate chosen variant by color/size in Product
  const color = item.Product?.colors?.find(
    (c) => c.name === (item as any).color
  );
  const variant = color?.variants?.find(
    (v) => v.size?.name === (item as any).size
  );
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
      orderSelectedItems: [],
      totalPrice: '0',
      selectedItems: [],
      selectedTotalPrice: 0,
      status: 'idle',

      // Load cart from server and normalize totals
      fetchCart: async (userId: number) => {
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
            };
          });
        } catch {
          set({ status: 'error' });
        }
      },

      // Replace cart items and recompute totals (also reconcile selection)
      setCartItems: (cartItems) =>
        set((state) => {
          const total = sumAll(cartItems);
          const validSelected = state.selectedItems.filter((sid) =>
            cartItems.some((it) => Number(it.id) === sid)
          );
          const selectedTotal = sumSelected(cartItems, validSelected);
          return {
            cartItems,
            totalPrice: formatMoney(total),
            selectedItems: validSelected,
            selectedTotalPrice: selectedTotal,
          };
        }),

      // Set order selected items
      setOrderSelectedItems: (items) => set({ orderSelectedItems: items }),

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
          };
        }),

      // Clear everything
      clearCart: () =>
        set(() => {
          localStorage.removeItem('cart-storage');

          return {
            cartItems: [],
            orderSelectedItems: [],
            totalPrice: '0',
            selectedItems: [],
            selectedTotalPrice: 0,
            status: 'idle',
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
      // Chỉ định các key muốn lưu vào localStorage
      partialize: (state) => ({
        orderSelectedItems: state.orderSelectedItems,
        selectedItems: state.selectedItems,
        // selectedTotalPrice: state.selectedTotalPrice,
      }),
    }
  )
);
