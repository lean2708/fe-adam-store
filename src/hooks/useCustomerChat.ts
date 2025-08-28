"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChatWidgetStore } from "@/stores/chatWidgetStore";
import { chatWebSocketService } from "@/lib/websocket/chat-websocket";
import {
  fetchMyConversationsAction,
  createConversationAction,
  fetchMessagesAction
} from "@/actions/chatActions";
import type {
  ChatMessageResponse,
  ConversationResponse
} from "@/api-client/models";
import { BASE_PATH } from "@/api-client/base";

export function useCustomerChat() {
  const { user, isAuthenticated } = useAuth();
  const {
    currentConversationId,
    setConversationId,
    incrementUnreadCount,
    resetUnreadCount,
    isOpen
  } = useChatWidgetStore();

  // State
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Initialize chat when user is authenticated
  const initializeChat = useCallback(async () => {
    if (!isAuthenticated || !user || hasInitialized.current) return;

    try {
      setIsLoading(true);
      setError(null);
      hasInitialized.current = true;

      // Connect to WebSocket
      if (!isWebSocketConnected) {
        setIsConnecting(true);
        await chatWebSocketService.connect(
          {
            baseUrl: BASE_PATH,
            accessToken: (user as any).accessToken || "",
            userId: user.id || "",
          },
          {
            onMessage: handleNewMessage,
            onConversationUpdate: handleConversationUpdate,
            onConnect: () => {
              setIsWebSocketConnected(true);
              setIsConnecting(false);
            },
            onDisconnect: () => {
              setIsWebSocketConnected(false);
            },
            onError: (error) => {
              console.error("WebSocket error:", error);
              setIsWebSocketConnected(false);
              setIsConnecting(false);
            },
          }
        );
      }

      // Get or create conversation with admin
      await getOrCreateConversation();

    } catch (error) {
      console.error("Error initializing chat:", error);
      setError(error instanceof Error ? error.message : "Failed to initialize chat");
    } finally {
      setIsLoading(false);
      setIsConnecting(false);
    }
  }, [isAuthenticated, user, isWebSocketConnected]);

  // Get or create conversation with admin
  const getOrCreateConversation = useCallback(async () => {
    if (!user) return;

    try {
      // First, try to get existing conversations
      const conversationsResult = await fetchMyConversationsAction();

      if (conversationsResult.success && conversationsResult.data) {

        // Look for existing conversation with admin
        const existingConversation = conversationsResult.data.find(conv =>
          conv.type === "DIRECT" &&
          conv.participants?.some(p => p.email?.includes("admin@gmail.com") || p.name?.toLowerCase().includes("admin@gmail.com"))
        );
        console.log(existingConversation?.participants?.at(1)?.email + "phungvipokk");

        if (existingConversation) {
          setConversation(existingConversation);
          setConversationId(existingConversation.id || null);
          await loadMessages(existingConversation.id || "");
          return;
        }
      }

      // If no existing conversation, create one with admin
      // Note: This will create a conversation that admins can see in their chat interface
      const createResult = await createConversationAction({
        type: "DIRECT",
        participantIds: [1] // Empty array - backend should handle admin assignment
      });

      if (createResult.success && createResult.data) {
        setConversation(createResult.data);
        setConversationId(createResult.data.id || null);
        await loadMessages(createResult.data.id || "");
      }

    } catch (error) {
      console.error("Error getting/creating conversation:", error);
      setError("Failed to start conversation");
    }
  }, [user, setConversationId]);

  // Load messages for conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      console.log("Loading messages for conversation:", conversationId);
      const result = await fetchMessagesAction(conversationId);

      if (result.success && result.data) {
        console.log("Loaded messages:", result.data.length);
        setMessages(result.data);

        // Subscribe to conversation for real-time updates
        if (isWebSocketConnected) {
          console.log("Subscribing to conversation for real-time updates");
          chatWebSocketService.subscribeToConversation(conversationId);
        } else {
          console.log("WebSocket not connected, will subscribe when connected");
        }

        // Scroll to bottom after messages are loaded
        setTimeout(scrollToBottom, 300);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }, [isWebSocketConnected, scrollToBottom]);

  // Handle new message from WebSocket
  const seenIds = useRef(new Set<string>());
  const lastAddedIdRef = useRef<string | null>(null);

  const handleNewMessage = useCallback((message: ChatMessageResponse) => {
    console.log("Received new message:", message);

    // Hard dedupe before state (also protects against duplicate WS events)
    if (seenIds.current.has(message.id || "")) return;
    seenIds.current.add(message.id || "");

    setMessages(prev => {
      const exists = prev.some(m => m.id === message.id);
      console.log("Checking message existence:", {
        newMessageId: message.id,
        existingIds: prev.map(m => m.id),
        exists,
      });

      if (exists) return prev;

      lastAddedIdRef.current = message.id || ""; // mark what we actually added
      return [...prev, message];
    });

    setTimeout(scrollToBottom, 200);
  }, [scrollToBottom]);

  // Increment unread in an effect; guard with ref so Strict Mode won’t double-count
  useEffect(() => {
    if (!isOpen && lastAddedIdRef.current) {
      const justAddedId = lastAddedIdRef.current;
      lastAddedIdRef.current = null; // clear immediately to avoid duplicate increments in Strict Mode

      // find the message to check `me` flag (optional optimization)
      // if you keep `message.me` available some other way, use that.
      // Here we just increment blindly; or find by id if needed:
      // const msg = messages.find(m => m.id === justAddedId);
      // if (msg && !msg.me) incrementUnreadCount();

      incrementUnreadCount();
    }
  }, [messages.length, isOpen, incrementUnreadCount]);

  // Handle conversation update from WebSocket
  const handleConversationUpdate = useCallback((updatedConversation: ConversationResponse) => {
    if (updatedConversation.id === currentConversationId) {
      setConversation(updatedConversation);
    }
  }, [currentConversationId]);

  // Send message
  const sendMessage = useCallback(async (messageText: string) => {
    if (!conversation?.id || !messageText.trim() || !isWebSocketConnected) {
      console.log("Cannot send message:", {
        hasConversation: !!conversation?.id,
        hasText: !!messageText.trim(),
        isConnected: isWebSocketConnected
      });
      return;
    }

    try {
      console.log("Sending message:", messageText.trim());
      chatWebSocketService.sendMessage(conversation.id, messageText.trim());
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  }, [conversation?.id, isWebSocketConnected]);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (isOpen) {
      resetUnreadCount();
    }
  }, [isOpen, resetUnreadCount]);

  // Subscribe to conversation when WebSocket connects
  useEffect(() => {
    if (isWebSocketConnected && currentConversationId) {
      console.log("WebSocket connected, subscribing to conversation:", currentConversationId);
      chatWebSocketService.subscribeToConversation(currentConversationId);
    }
  }, [isWebSocketConnected, currentConversationId]);

  // Initialize chat when component mounts
  useEffect(() => {
    if (isAuthenticated && user && !hasInitialized.current) {
      initializeChat();
    }
  }, [isAuthenticated, user, initializeChat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentConversationId) {
        chatWebSocketService.unsubscribeFromConversation(currentConversationId);
      }
    };
  }, [currentConversationId]);

  return {
    // State
    conversation,
    messages,
    isLoading,
    isConnecting,
    isWebSocketConnected,
    error,

    // Actions
    sendMessage,
    initializeChat,

    // Refs
    messagesEndRef,
  };
}
