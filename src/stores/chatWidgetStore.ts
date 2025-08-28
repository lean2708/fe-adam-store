"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatWidgetState {
  // Widget state
  isOpen: boolean;
  isMinimized: boolean;
  
  // Chat state
  currentConversationId: string | null;
  unreadCount: number;
  
  // Actions
  openWidget: () => void;
  closeWidget: () => void;
  toggleWidget: () => void;
  minimizeWidget: () => void;
  maximizeWidget: () => void;
  setConversationId: (id: string | null) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
}

export const useChatWidgetStore = create<ChatWidgetState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOpen: false,
      isMinimized: true,
      currentConversationId: null,
      unreadCount: 0,

      // Actions
      openWidget: () => set({ isOpen: true, isMinimized: false }),
      
      closeWidget: () => set({ 
        isOpen: false, 
        isMinimized: false,
        unreadCount: 0 
      }),
      
      toggleWidget: () => {
        const { isOpen } = get();
        if (isOpen) {
          set({ isOpen: false, isMinimized: false, unreadCount: 0 });
        } else {
          set({ isOpen: true, isMinimized: false });
        }
      },
      
      minimizeWidget: () => set({ isMinimized: true }),
      
      maximizeWidget: () => set({ isMinimized: false }),
      
      setConversationId: (id) => set({ currentConversationId: id }),
      
      setUnreadCount: (count) => set({ unreadCount: Math.max(0, count) }),
      
      incrementUnreadCount: () => set((state) => ({ 
        unreadCount: state.unreadCount + 1 
      })),
      
      resetUnreadCount: () => set({ unreadCount: 0 }),
    }),
    {
      name: "chat-widget-storage",
      partialize: (state) => ({
        currentConversationId: state.currentConversationId,
        // Don't persist isOpen, isMinimized, or unreadCount
      }),
    }
  )
);
