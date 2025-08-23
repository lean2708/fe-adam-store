'use client';

import { AddressItem } from '@/types';
import { create } from 'zustand';

type AddressState = {
  currentAddress: AddressItem | null;
  setCurrentAddress: (Address: AddressItem | null) => void;
};

export const useAddressStore = create<AddressState>((set) => ({
  currentAddress: null,
  setCurrentAddress: (Address) => set({ currentAddress: Address }),
}));
