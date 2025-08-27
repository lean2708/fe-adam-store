'use client';

import { TAddressItem } from '@/types';
import { create } from 'zustand';

type AddressState = {
  currentAddress: TAddressItem | null;
  setCurrentAddress: (Address: TAddressItem | null) => void;
};

export const useAddressStore = create<AddressState>((set) => ({
  currentAddress: null,
  setCurrentAddress: (Address) => set({ currentAddress: Address }),
}));
