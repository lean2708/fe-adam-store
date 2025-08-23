'use client';

import { PAYMENT_METHODS } from '@/enums';
import { TOrder } from '@/types';
import { create } from 'zustand';

export type State = {
  paymentMethod: PAYMENT_METHODS | null;
  orders: TOrder[];
};

export type Actions = {
  setOrders: (orders: TOrder[]) => void;
  setPaymentMethod: (method: PAYMENT_METHODS) => void;
  reset: () => void;
};

export const useOrderStore = create<State & Actions>()((set) => ({
  orders: [],
  paymentMethod: null,

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () => set({ paymentMethod: null }),
  setOrders: (orders) => set({ orders }),
}));
