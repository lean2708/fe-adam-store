// stores/buyNowStore.ts
import { TProductVariant } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BuyNowStore {
  buyNowItems: TProductVariant[];
  setBuyNowItems: (items: TProductVariant[]) => void;
  clearBuyNowItems: () => void;
  addBuyNowItem: (item: TProductVariant) => void;
  // Thêm computed values
  totalPrice: number;
  totalQuantity: number;
}

export const useBuyNowStore = create<BuyNowStore>()(
  persist(
    (set, get) => ({
      buyNowItems: [],

      setBuyNowItems: (items) => set({ buyNowItems: items }),

      clearBuyNowItems: () => {
        useBuyNowStore.persist.clearStorage();
        set({ buyNowItems: [] });
      },

      addBuyNowItem: (item) =>
        set((state) => ({
          buyNowItems: [...state.buyNowItems, item],
        })),

      // Computed values
      get totalPrice() {
        return get().buyNowItems.reduce(
          (sum, item) => sum + item.price! * item.quantity!,
          0
        );
      },

      get totalQuantity() {
        return get().buyNowItems.reduce((sum, item) => sum + item.quantity!, 0);
      },
    }),
    {
      name: 'buy-now-storage',
      // Sử dụng localStorage thay vì sessionStorage để tránh mất data
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist items, không persist computed values
      partialize: (state) => ({
        buyNowItems: state.buyNowItems,
      }),
    }
  )
);
