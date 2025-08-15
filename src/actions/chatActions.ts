"use server";

import type { ActionResponse } from "@/lib/types/actions";
import type {
  ChatMessageResponse,
  ConversationResponse,
  ConversationRequest
} from "@/api-client/models";
import {
  fetchMessages,
  searchMessages,
  deleteMessage,
  fetchMyConversations,
  createConversation,
  searchConversationsByName
} from "@/lib/data/chat";

/**
 * Get all messages for a conversation
 */
export async function fetchMessagesAction(
  conversationId: string
): Promise<ActionResponse<ChatMessageResponse[]>> {
  try {
    const data = await fetchMessages(conversationId);
    const sortedData = (data || []).sort(
      (a, b) => new Date(a.createdDate || '').getTime() - new Date(b.createdDate || '').getTime()
    );
    return {
      success: true,
      data: sortedData,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch messages",
    };
  }
}

/**
 * Search messages in a conversation by keyword
 */
export async function searchMessagesAction(
  conversationId: string,
  keyword: string
): Promise<ActionResponse<ChatMessageResponse[]>> {
  try {
    const data = await searchMessages(conversationId, keyword);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to search messages",
    };
  }
}

/**
 * Delete a message by ID
 */
export async function deleteMessageAction(
  messageId: string
): Promise<ActionResponse<void>> {
  try {
    await deleteMessage(messageId);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete message",
    };
  }
}

/**
 * Get conversations of current user
 */
export async function fetchMyConversationsAction(): Promise<ActionResponse<ConversationResponse[]>> {
  try {
    const data = await fetchMyConversations();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch conversations",
    };
  }
}

/**
 * Create or retrieve a conversation
 */
export async function createConversationAction(
  conversationData: ConversationRequest
): Promise<ActionResponse<ConversationResponse>> {
  try {
    const data = await createConversation(conversationData);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create conversation",
    };
  }
}

/**
 * Search conversations by name
 */
export async function searchConversationsByNameAction(
  name: string
): Promise<ActionResponse<ConversationResponse[]>> {
  try {
    const data = await searchConversationsByName(name);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to search conversations",
    };
  }
}
