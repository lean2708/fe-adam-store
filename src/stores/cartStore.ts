'use client';

import { TCartItem } from '@/types';
import { create } from 'zustand';

export type State = {
  cartItems: TCartItem[];
  totalPrice: string;
  selectedItems: number[];
};

export type Actions = {
  setCartItems: (cartItems: TCartItem[]) => void;
  toggleItemSelection: (id: number) => void;
  toggleAllItems: (select: boolean) => void;
  updateCartItem: (itemId: string, newData: Partial<TCartItem>) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<State & Actions>()((set) => ({
  cartItems: [],
  totalPrice: '0',
  selectedItems: [],

  setCartItems: (cartItems) =>
    set(() => {
      let totalPrice = 0;
      cartItems.map((cartItem) => {
        totalPrice +=
          cartItem.quantity *
          Number(cartItem.Product?.colors?.[0]?.variants?.[0]?.price ?? 0);
      });
      return { cartItems, totalPrice: totalPrice.toFixed(2) };
    }),
  updateCartItem: (itemId, newData) =>
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === itemId ? { ...item, ...newData } : item
      );

      // Recalculate totalPrice
      const totalPrice = updatedCartItems.reduce((sum, item) => {
        return (
          sum +
          item.quantity *
            Number(item.Product?.colors?.[0]?.variants?.[0]?.price ?? 0)
        );
      }, 0);

      return {
        cartItems: updatedCartItems,
        totalPrice: totalPrice.toFixed(2),
      };
    }),
  removeCartItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((ci) => ci.id !== id),
    })),
  clearCart: () => set({ cartItems: [] }),

  toggleItemSelection: (id) =>
    set((state) => {
      const selectedItems = [...state.selectedItems];
      const index = selectedItems.indexOf(id);

      if (index === -1) {
        selectedItems.push(id);
      } else {
        selectedItems.splice(index, 1);
      }

      return { selectedItems };
    }),
  toggleAllItems: (select) =>
    set((state) => {
      if (select) {
        const allIds = state.cartItems.map((item) => Number(item.id));
        return { selectedItems: allIds };
      }
      return { selectedItems: [] };
    }),
}));
