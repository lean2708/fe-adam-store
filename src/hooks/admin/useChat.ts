"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { BASE_PATH } from '@/api-client/base';
import { chatWebSocketService } from "@/lib/websocket/chat-websocket";
import type { ChatWebSocketCallbacks } from "@/lib/websocket/chat-websocket";
import {
  fetchMyConversationsAction,
  fetchMessagesAction,
  deleteMessageAction
} from "@/actions/chatActions";
import type { TConversation, TChatMessage } from "@/types";

export function useChat() {
  const { data: session } = useSession();
  const t = useTranslations("Admin.chat");
  const queryClient = useQueryClient();

  // State management
  const [selectedConversation, setSelectedConversation] = useState<TConversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  // React Query: Fetch conversations
  const conversationsQuery = useQuery({
    queryKey: ['chat-conversations', searchTerm],
    queryFn: async () => {
      let result;

      if (searchTerm?.trim()) {
        result = await fetchMyConversationsAction();
      } else {
        result = await fetchMyConversationsAction();
      }

      if (!result.success) {
        throw new Error(result.message || t("conversationLoadError") || "Failed to load conversations");
      }

      return result.data || [];
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query: Fetch messages
  const messagesQuery = useQuery({
    queryKey: ['chat-messages', selectedConversation?.id],
    queryFn: async () => {
      if (!selectedConversation?.id) return [];

      const result = await fetchMessagesAction(selectedConversation.id);

      if (!result.success) {
        throw new Error(result.message || t("messagesLoadError") || "Failed to load messages");
      }

      return result.data || [];
    },
    enabled: !!selectedConversation?.id,
    staleTime: 10000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // React Query: Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const result = await deleteMessageAction(messageId);
      if (!result.success) {
        throw new Error(result.message || t("deleteMessageError") || "Failed to delete message");
      }
      return result;
    },
    onSuccess: (_, messageId) => {
      toast.success(t("messageDeleted") || "Message deleted successfully");

      // Update messages cache by removing the deleted message
      queryClient.setQueriesData(
        { queryKey: ['chat-messages'] },
        (oldData: TChatMessage[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(message => message.id !== messageId);
        }
      );
    },
    onError: (error: Error) => {
      console.error("Error deleting message:", error);
      toast.error(error.message);
    },
  });

  // WebSocket callbacks
  const webSocketCallbacks = useCallback((): ChatWebSocketCallbacks => ({
    onMessage: (message: TChatMessage) => {
      console.log('📨 New message received:', message);

      // Get current subscribed conversations
      const subscribedConversations = chatWebSocketService.getSubscribedConversations();
      console.log('📡 Currently subscribed to:', subscribedConversations);

      // Check if message belongs to a subscribed conversation
      if (message.conversationId && subscribedConversations.includes(message.conversationId)) {
        console.log('✅ Message belongs to subscribed conversation, updating cache');

        // Update the messages cache for this conversation
        queryClient.setQueryData(
          ['chat-messages', message.conversationId],
          (oldData: TChatMessage[] | undefined) => {
            if (!oldData) return [message];

            // Check if message already exists (avoid duplicates)
            const exists = oldData.some(m => m.id === message.id);
            if (exists) {
              console.log('⚠️ Message already exists in cache, skipping');
              return oldData;
            }

            console.log('✅ Adding new message to cache');
            return [...oldData, message]; // Append new message
          }
        );

        // If this is not the currently selected conversation, refetch to ensure we have latest data
        if (selectedConversation?.id !== message.conversationId) {
          console.log('🔄 Message for non-selected conversation, triggering refetch');
          queryClient.invalidateQueries({
            queryKey: ['chat-messages', message.conversationId]
          });
        }
      } else {
        console.log('⚠️ Message for unsubscribed conversation, ignoring');
      }
    },
    onConversationUpdate: (conversation: TConversation) => {
      // Optimistically update conversations cache
      queryClient.setQueriesData(
        { queryKey: ['chat-conversations'] },
        (oldData: TConversation[] | undefined) => {
          if (!oldData) return [conversation];

          const exists = oldData.some(c => c.id === conversation.id);
          if (exists) {
            return oldData.map(c => c.id === conversation.id ? conversation : c);
          } else {
            toast.success(`${t('newConversation')} ${conversation.participants?.[0]?.name || 'khách hàng'}`);
            return [conversation, ...oldData];
          }
        }
      );
    },
    onMessageDeleted: (messageId: string) => {
      // Remove message from current conversation
      if (selectedConversation?.id) {
        queryClient.setQueryData(
          ['chat-messages', selectedConversation.id],
          (oldData: TChatMessage[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.filter(message => message.id !== messageId);
          }
        );
      }
    },
    onConnect: () => {
      console.log('✅ WebSocket connected');
      setIsWebSocketConnected(true);
      toast.success(t('websocketConnected') || 'Kết nối real-time thành công!');
    },
    onDisconnect: () => {
      console.log('❌ WebSocket disconnected');
      setIsWebSocketConnected(false);
      toast.warning(t('websocketDisconnected') || 'Mất kết nối real-time');
    },
    onError: (error) => {
      console.error('❌ WebSocket error:', error);
      setIsWebSocketConnected(false);
      toast.error(t('websocketError') || 'Lỗi kết nối real-time');
    },
  }), [selectedConversation?.id, queryClient, t]);

  // Initialize WebSocket connection with optimization
  useEffect(() => {
    let mounted = true;

    const initializeConnection = async () => {
      if (!session?.accessToken || !session?.user?.id || !mounted) return;

      try {
        const config = {
          baseUrl: BASE_PATH,
          accessToken: session.accessToken,
          userId: session.user.id,
        };

        console.log('🔄 Initializing WebSocket connection...');
        await chatWebSocketService.connect(config, webSocketCallbacks());

        if (mounted) {
          console.log('✅ WebSocket connection initialized');
        }
      } catch (error) {
        if (mounted) {
          console.error('❌ Failed to initialize WebSocket:', error);
        }
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
      // Only disconnect if this is the last instance
      if (session?.accessToken) {
        chatWebSocketService.disconnect();
      }
    };
  }, [session?.accessToken, session?.user?.id]); // Removed webSocketCallbacks dependency

  // Update WebSocket callbacks when they change (optimized)
  useEffect(() => {
    if (chatWebSocketService.isWebSocketConnected()) {
      chatWebSocketService.updateCallbacks(webSocketCallbacks());
    }
  }, [selectedConversation?.id, queryClient, t]); // More specific dependencies

  // Method to refetch messages for all subscribed conversations
  const refetchSubscribedConversations = useCallback(() => {
    const subscribedConversations = chatWebSocketService.getSubscribedConversations();
    console.log('🔄 Refetching messages for subscribed conversations:', subscribedConversations);

    subscribedConversations.forEach(conversationId => {
      queryClient.invalidateQueries({
        queryKey: ['chat-messages', conversationId]
      });
    });
  }, [queryClient]);

  // Method to get current subscription status
  const getSubscriptionStatus = useCallback(() => {
    const subscribedConversations = chatWebSocketService.getSubscribedConversations();
    const isConnected = chatWebSocketService.isWebSocketConnected();

    return {
      isConnected,
      subscribedConversations,
      totalSubscriptions: subscribedConversations.length,
      isCurrentConversationSubscribed: selectedConversation?.id
        ? subscribedConversations.includes(selectedConversation.id)
        : false
    };
  }, [selectedConversation?.id]);

  // Optimized periodic check for subscribed conversations
  useEffect(() => {
    if (!isWebSocketConnected) return;

    // Use a longer interval and more intelligent checking
    const checkInterval = 60000; // Check every 60 seconds (reduced frequency)
    const staleTime = 120000; // Consider data stale after 2 minutes

    const intervalId = setInterval(() => {
      const subscribedConversations = chatWebSocketService.getSubscribedConversations();

      if (subscribedConversations.length === 0) return;

      console.log('🔄 Periodic health check for subscribed conversations');

      let staleCount = 0;
      subscribedConversations.forEach(conversationId => {
        const queryState = queryClient.getQueryState(['chat-messages', conversationId]);
        const now = Date.now();

        if (queryState?.dataUpdatedAt && (now - queryState.dataUpdatedAt > staleTime)) {
          staleCount++;
          console.log(`🔄 Refreshing stale conversation: ${conversationId}`);
          queryClient.invalidateQueries({
            queryKey: ['chat-messages', conversationId],
            exact: true
          });
        }
      });

      if (staleCount > 0) {
        console.log(`✅ Refreshed ${staleCount} stale conversations`);
      }
    }, checkInterval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isWebSocketConnected, queryClient]);

  // Handlers
  const handleConversationSelect = useCallback((conversation: TConversation) => {
    console.log('🔄 Selecting conversation:', conversation.id);

    // Unsubscribe from previous conversation if any
    if (selectedConversation?.id && chatWebSocketService.isWebSocketConnected()) {
      console.log('📡 Unsubscribing from previous conversation:', selectedConversation.id);
      chatWebSocketService.unsubscribeFromConversation(selectedConversation.id);
    }

    setSelectedConversation(conversation);

    // Subscribe to new conversation for real-time updates
    if (conversation.id && chatWebSocketService.isWebSocketConnected()) {
      console.log('📡 Subscribing to new conversation:', conversation.id);
      chatWebSocketService.subscribeToConversation(conversation.id);

      // Log current subscriptions for debugging
      const currentSubscriptions = chatWebSocketService.getSubscribedConversations();
      console.log('📡 Current subscriptions after selection:', currentSubscriptions);
    }

  }, [selectedConversation?.id]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !selectedConversation?.id) return;

    const conversationId = selectedConversation.id;
    const trimmedMessage = message.trim();

    try {
      // Send via WebSocket (will queue if disconnected)
      chatWebSocketService.sendMessage(conversationId, trimmedMessage);

      // The WebSocket callback will handle adding the message to cache
      console.log('✅ Message sent successfully');

    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error(t('sendMessageError') || 'Lỗi khi gửi tin nhắn');
    }
  }, [selectedConversation?.id, t]);

  const handleDeleteMessage = useCallback((messageId: string) => {
    if (!confirm(t('confirmDeleteMessage') || 'Bạn có chắc chắn muốn xóa tin nhắn này?')) return;

    try {
      chatWebSocketService.deleteMessage(messageId);
      toast.success(t('messageDeletedWebSocket') || 'Đã xóa tin nhắn qua WebSocket!');
    } catch (error) {
      console.error('❌ Error deleting message:', error);
      toast.error(t('deleteMessageError') || 'Lỗi khi xóa tin nhắn');
    }
  }, [t]);

  const handleCreateConversation = useCallback((participantIds: number[], type: 'DIRECT' | 'GROUP' = 'DIRECT') => {
    try {
      chatWebSocketService.createConversation(participantIds, type);
      toast.success(t('creatingConversation') || 'Đang tạo cuộc trò chuyện...');
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      toast.error('Lỗi khi tạo cuộc trò chuyện');
    }
  }, [t]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');

    // Refresh conversations
    conversationsQuery.refetch();

    // Refresh messages for selected conversation
    if (selectedConversation?.id) {
      messagesQuery.refetch();
    }

    // Also refresh all subscribed conversations
    const subscribedConversations = chatWebSocketService.getSubscribedConversations();
    console.log('🔄 Refreshing all subscribed conversations:', subscribedConversations);

    subscribedConversations.forEach(conversationId => {
      if (conversationId !== selectedConversation?.id) {
        queryClient.invalidateQueries({
          queryKey: ['chat-messages', conversationId]
        });
      }
    });
  }, [conversationsQuery, messagesQuery, selectedConversation?.id, queryClient]);

  const handleRefreshConversations = useCallback(() => {
    conversationsQuery.refetch();
  }, [conversationsQuery]);

  const handleRefreshMessages = useCallback(async () => {
    if (!selectedConversation?.id) return;

    try {
      console.log('🔄 Starting message refresh for conversation:', selectedConversation.id);

      // First check if WebSocket is connected and force refresh via WebSocket
      if (chatWebSocketService.isWebSocketConnected()) {
        console.log('🔄 Refreshing via WebSocket...');
        chatWebSocketService.refreshConversationMessages(selectedConversation.id);

        // Small delay to allow WebSocket to process re-subscription
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Then refetch from API to ensure we have all messages and sync with server
      console.log('🔄 Refetching messages from API...');
      const result = await messagesQuery.refetch();

      if (result.isSuccess) {
        console.log('✅ Messages refreshed successfully, count:', result.data?.length || 0);
        // toast.success(t('messagesRefreshed') || 'Tin nhắn đã được làm mới');
      } else {
        throw new Error('Failed to refetch messages');
      }
    } catch (error) {
      console.error('❌ Error refreshing messages:', error);
      toast.error(t('refreshMessagesError') || 'Lỗi khi làm mới tin nhắn');
    }
  }, [messagesQuery, selectedConversation?.id, t]);

  // Filter conversations based on search term (client-side filtering for better UX)
  const filteredConversations = (conversationsQuery.data || []).filter(conversation => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const participantNames = conversation.participants?.map(p => p.name?.toLowerCase() || '') || [];
    const conversationName = conversation.conversationName?.toLowerCase() || '';

    return participantNames.some(name => name.includes(searchLower)) ||
      conversationName.includes(searchLower);
  });

  return {
    // Data
    conversations: filteredConversations,
    messages: messagesQuery.data || [],
    selectedConversation,
    searchTerm,

    // Loading states
    conversationsLoading: conversationsQuery.isLoading,
    messagesLoading: messagesQuery.isLoading,

    // Error states
    conversationsError: conversationsQuery.error,
    messagesError: messagesQuery.error,

    // WebSocket state
    isWebSocketConnected,

    // Handlers
    handleConversationSelect,
    handleSendMessage,
    handleDeleteMessage,
    handleCreateConversation,
    handleSearch,
    handleRefresh,
    handleRefreshConversations,
    handleRefreshMessages,

    // State setters
    setSelectedConversation,
    setSearchTerm,

    // Direct access to queries (for advanced usage)
    conversationsQuery,
    messagesQuery,
    deleteMessageMutation,

    // WebSocket service (for advanced usage)
    webSocketService: chatWebSocketService,

    // Subscription management
    refetchSubscribedConversations,
    getSubscriptionStatus,
  };
}
