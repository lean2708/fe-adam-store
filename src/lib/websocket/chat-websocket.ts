"use client";

import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';
import type { ChatMessageResponse, ConversationResponse } from '@/api-client/models';

export interface WebSocketConfig {
  baseUrl: string;
  accessToken: string;
  userId: string | number;
}

export interface ChatWebSocketCallbacks {
  onMessage?: (message: ChatMessageResponse) => void;
  onConversationUpdate?: (conversation: ConversationResponse) => void;
  onMessageDeleted?: (messageId: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export class ChatWebSocketService {
  private stompClient: Client | null = null;
  private config: WebSocketConfig | null = null;
  private callbacks: ChatWebSocketCallbacks = {};
  private subscribedConversations = new Set<string>();
  private subscriptionObjects = new Map<string, StompSubscription>();
  private userSubscription: StompSubscription | null = null; // Store user subscription separately
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private connectionPromise: Promise<void> | null = null; // Track connection state
  private messageQueue: Array<() => void> = []; // Queue messages when disconnected
  constructor() {
    // Bind methods to preserve context
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.createConversation = this.createConversation.bind(this);
    this.subscribeToConversation = this.subscribeToConversation.bind(this);
    this.unsubscribeFromConversation = this.unsubscribeFromConversation.bind(this);
  }

  /**
   * Initialize and connect to WebSocket
   */
  async connect(config: WebSocketConfig, callbacks: ChatWebSocketCallbacks = {}) {
    // Return existing connection promise if already connecting
    if (this.connectionPromise) {
      console.log('🔄 Connection already in progress, waiting...');
      return this.connectionPromise;
    }

    // Return immediately if already connected with same config
    if (this.isConnected && this.config?.accessToken === config.accessToken) {
      console.log('✅ Already connected with same config');
      this.callbacks = { ...this.callbacks, ...callbacks };
      return Promise.resolve();
    }

    this.connectionPromise = this._performConnection(config, callbacks);
    return this.connectionPromise;
  }

  /**
   * Internal method to perform the actual connection
   */
  private async _performConnection(config: WebSocketConfig, callbacks: ChatWebSocketCallbacks) {
    try {
      this.config = config;
      this.callbacks = { ...this.callbacks, ...callbacks };

      console.log('🔌 Connecting to WebSocket...', config.baseUrl);

      // Disconnect existing connection if any
      if (this.stompClient?.connected) {
        this.disconnect();
      }

      // Create STOMP client with optimized settings
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(`${config.baseUrl}/ws`),
        connectHeaders: {
          Authorization: `Bearer ${config.accessToken}`,
        },
        debug: (str) => console.log(`[STOMP] ${str}`),
        reconnectDelay: 3000, // Reduced from 5000
        heartbeatIncoming: 10000, // Increased for better performance
        heartbeatOutgoing: 10000,
        connectionTimeout: 10000, // Add connection timeout
      });

      // Set up optimized event handlers
      this.stompClient.onConnect = () => {
        console.log('✅ WebSocket connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.connectionPromise = null; // Clear connection promise

        // Subscribe to user-specific updates
        this.subscribeToUserUpdates();

        // Process queued messages
        this.processMessageQueue();

        this.callbacks.onConnect?.();
      };

      this.stompClient.onStompError = (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
        this.isConnected = false;
        this.connectionPromise = null;
        this.callbacks.onError?.(new Error(frame.headers['message']));

        // Attempt reconnection on STOMP errors
        this.attemptReconnection();
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnected = false;
        this.connectionPromise = null;
        this.callbacks.onError?.(error);
      };

      this.stompClient.onDisconnect = () => {
        console.log('❌ WebSocket disconnected');
        this.isConnected = false;
        this.connectionPromise = null;
        this.callbacks.onDisconnect?.();
      };

      // Activate the client
      this.stompClient.activate();

    } catch (error) {
      console.error('💥 Error connecting to WebSocket:', error);
      this.callbacks.onError?.(error);

      // Attempt reconnection
      this.attemptReconnection();
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    console.log('🔌 Disconnecting from WebSocket...');

    // Clear connection promise
    this.connectionPromise = null;

    // Unsubscribe from user updates
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      this.userSubscription = null;
    }

    // Unsubscribe from all conversations
    this.subscriptionObjects.forEach((subscription, conversationId) => {
      console.log('📡 Unsubscribing from conversation during disconnect:', conversationId);
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.warn('⚠️ Error unsubscribing from conversation:', conversationId, error);
      }
    });

    // Deactivate STOMP client
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
      } catch (error) {
        console.warn('⚠️ Error deactivating STOMP client:', error);
      }
    }

    // Reset state
    this.isConnected = false;
    this.subscribedConversations.clear();
    this.subscriptionObjects.clear();
    this.messageQueue = []; // Clear message queue on disconnect
    this.reconnectAttempts = 0;

    console.log('✅ WebSocket disconnected and cleaned up');
  }

  /**
   * Process queued messages when connection is restored
   */
  private processMessageQueue() {
    if (this.messageQueue.length > 0) {
      console.log(`🔄 Processing ${this.messageQueue.length} queued messages`);

      const queue = [...this.messageQueue];
      this.messageQueue = [];

      queue.forEach(messageAction => {
        try {
          messageAction();
        } catch (error) {
          console.error('❌ Error processing queued message:', error);
        }
      });
    }
  }

  /**
   * Subscribe to user-specific updates (new conversations, etc.)
   */
  private subscribeToUserUpdates() {
    if (!this.stompClient || !this.config) return;

    // Unsubscribe from previous user subscription if exists
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    const userTopic = `/topic/user.${this.config.userId}`;
    console.log('📡 Subscribing to user updates:', userTopic);

    this.userSubscription = this.stompClient.subscribe(userTopic, (message) => {
      try {
        const conversation: ConversationResponse = JSON.parse(message.body);
        console.log('📨 Received conversation update:', conversation);
        this.callbacks.onConversationUpdate?.(conversation);
      } catch (error) {
        console.error('❌ Error parsing conversation update:', error);
      }
    });
  }

  /**
   * Subscribe to a specific conversation for real-time messages
   */
  subscribeToConversation(conversationId: string) {
    if (!this.stompClient || !this.isConnected) {
      console.warn('⚠️ Cannot subscribe: WebSocket not connected');
      return;
    }

    if (this.subscribedConversations.has(conversationId)) {
      console.log('ℹ️ Already subscribed to conversation:', conversationId);
      return;
    }

    const conversationTopic = `/topic/conversation.${conversationId}`;
    console.log('📡 Subscribing to conversation:', conversationTopic);

    const subscription = this.stompClient.subscribe(conversationTopic, (message) => {
      try {
        const messageData = JSON.parse(message.body) as ChatMessageResponse & {
          type?: string;
          messageId?: string;
        };
        console.log(messageData.sender?.userId, this.config?.userId);

        messageData.me = Number(messageData.sender?.userId) == Number(this.config?.userId)
        console.log('📨 Received message:', messageData);
        // Handle different message types
        if (messageData.type === 'DELETE') {
          this.callbacks.onMessageDeleted?.(messageData.messageId || '');
        } else {
          this.callbacks.onMessage?.(messageData);
        }
      } catch (error) {
        console.error('❌ Error parsing message:', error);
      }
    });

    // Store subscription object for proper unsubscribing
    this.subscriptionObjects.set(conversationId, subscription);
    this.subscribedConversations.add(conversationId);
  }

  /**
   * Unsubscribe from a conversation
   */
  unsubscribeFromConversation(conversationId: string) {
    if (this.subscribedConversations.has(conversationId)) {
      console.log('📡 Unsubscribing from conversation:', conversationId);

      // Get and unsubscribe using the stored subscription object
      const subscription = this.subscriptionObjects.get(conversationId);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptionObjects.delete(conversationId);
        console.log('✅ Successfully unsubscribed from conversation:', conversationId);
      }

      this.subscribedConversations.delete(conversationId);
    }
  }

  /**
   * Send a message through WebSocket (with queuing support)
   */
  sendMessage(conversationId: string, message: string) {
    const messagePayload = {
      conversationId,
      message: message.trim(),
    };

    const sendAction = () => {
      if (!this.stompClient || !this.isConnected) {
        throw new Error('WebSocket not connected');
      }

      console.log('📤 Sending message:', messagePayload);
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(messagePayload)
      });
    };

    if (!this.isConnected) {
      console.log('⏳ WebSocket not connected, queuing message');
      this.messageQueue.push(sendAction);

      // Attempt to reconnect if not already trying
      if (!this.connectionPromise) {
        this.attemptReconnection();
      }
      return;
    }

    try {
      sendAction();
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw error;
    }
  }

  /**
   * Delete a message through WebSocket (with queuing support)
   */
  deleteMessage(messageId: string) {
    const deleteAction = () => {
      if (!this.stompClient || !this.isConnected) {
        throw new Error('WebSocket not connected');
      }

      console.log('🗑️ Deleting message:', messageId);
      this.stompClient.publish({
        destination: '/app/chat.deleteMessage',
        body: JSON.stringify({ messageId })
      });
    };

    if (!this.isConnected) {
      console.log('⏳ WebSocket not connected, queuing delete action');
      this.messageQueue.push(deleteAction);

      // Attempt to reconnect if not already trying
      if (!this.connectionPromise) {
        this.attemptReconnection();
      }
      return;
    }

    try {
      deleteAction();
    } catch (error) {
      console.error('❌ Error deleting message:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation through WebSocket
   */
  createConversation(participantIds: number[], type: 'DIRECT' | 'GROUP' = 'DIRECT') {
    if (!this.stompClient || !this.isConnected) {
      console.error('❌ Cannot create conversation: WebSocket not connected');
      throw new Error('WebSocket not connected');
    }

    const conversationPayload = {
      type,
      participantIds,
    };

    console.log('➕ Creating conversation:', conversationPayload);

    this.stompClient.publish({
      destination: '/app/chat.createConversation',
      body: JSON.stringify(conversationPayload)
    });
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms...`);

    setTimeout(() => {
      if (this.config) {
        this.connect(this.config, this.callbacks).catch(() => {
          // If reconnection fails, try again
          this.attemptReconnection();
        });
      }
    }, delay);
  }

  /**
   * Get connection status
   */
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get subscribed conversations
   */
  getSubscribedConversations(): string[] {
    return Array.from(this.subscribedConversations);
  }

  /**
   * Update callbacks
   */
  updateCallbacks(callbacks: ChatWebSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Force refresh messages for a conversation by re-subscribing
   */
  refreshConversationMessages(conversationId: string) {
    if (!this.isConnected || !this.stompClient) {
      console.warn('⚠️ Cannot refresh: WebSocket not connected');
      return;
    }

    console.log('🔄 Force refreshing conversation messages:', conversationId);

    // Unsubscribe and re-subscribe to get fresh messages
    this.unsubscribeFromConversation(conversationId);

    // Small delay to ensure unsubscription is processed
    setTimeout(() => {
      this.subscribeToConversation(conversationId);
    }, 50);
  }

  /**
   * Check if conversation is subscribed
   */
  isConversationSubscribed(conversationId: string): boolean {
    return this.subscribedConversations.has(conversationId);
  }
}

// Singleton instance
export const chatWebSocketService = new ChatWebSocketService();
