'use client';

import { PAYMENT_METHODS } from '@/enums';
import { DEFAULT_PAYMENT_METHODS } from '@/lib/constants';
import { TPaymentMethodOption } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type State = {
  selectedMethod: PAYMENT_METHODS;
  availableMethods: TPaymentMethodOption[];
};

export type Actions = {
  setSelectedMethod: (paymentMethods: PAYMENT_METHODS) => void;
  setAvailableMethods: (paymentMethods: TPaymentMethodOption[]) => void;
  resetPaymentMethod: () => void;
};

export const usepaymentMethodsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      selectedMethod: PAYMENT_METHODS.CASH,
      availableMethods: DEFAULT_PAYMENT_METHODS,

      setSelectedMethod: (method: PAYMENT_METHODS) => {
        const state = get();
        const isMethodAvailable = state.availableMethods.some(
          (m) => m.value === method && m.isAvailable
        );

        if (isMethodAvailable) {
          set({ selectedMethod: method });
        } else {
          console.warn(`Payment method ${method} is not available`);
        }
      },

      setAvailableMethods: (methods: TPaymentMethodOption[]) => {
        const state = get();

        // Check if current selected method is still available
        const isCurrentMethodAvailable = methods.some(
          (m) => m.value === state.selectedMethod && m.isAvailable
        );

        // If current method is not available, select the first available method
        if (!isCurrentMethodAvailable) {
          const firstAvailable = methods.find((m) => m.isAvailable);
          set({
            availableMethods: methods,
            selectedMethod: firstAvailable?.value || PAYMENT_METHODS.CASH,
          });
        } else {
          set({ availableMethods: methods });
        }
      },

      resetPaymentMethod: () => {
        set({
          selectedMethod: PAYMENT_METHODS.CASH,
          availableMethods: DEFAULT_PAYMENT_METHODS,
        });
      },
    }),
    {
      name: 'payment-method-storage',
      partialize: (state) => ({
        selectedMethod: state.selectedMethod,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
