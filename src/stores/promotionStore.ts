'use client';

import { TPromotion } from '@/types';
import { create } from 'zustand';

type PromotionState = {
  selectedPromotion: TPromotion | null;
  setSelectedPromotion: (promotion: TPromotion | null) => void;
  clearPromotion: () => void;
};

export const usePromotionStore = create<PromotionState>((set) => ({
  selectedPromotion: null,
  setSelectedPromotion: (promotion) => set({ selectedPromotion: promotion }),
  clearPromotion: () => set({ selectedPromotion: null }),
}));
