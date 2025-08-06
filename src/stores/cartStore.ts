'use client';

import { TCartItem } from '@/types';
import { create } from 'zustand';

export type State = {
  cartItems: TCartItem[];
  totalPrice: string;
};

export type Actions = {
  setCartItems: (cartItems: TCartItem[]) => void;
  updateCartItem: (itemId: string, newData: Partial<TCartItem>) => void;
};

export const useCartStore = create<State & Actions>()((set) => ({
  cartItems: [],
  totalPrice: '0',
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
}));
