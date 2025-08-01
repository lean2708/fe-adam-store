import { ControllerFactory } from "./factory-api-client";
import type { 
  ChatMessageResponse,
  ConversationResponse,
  ConversationRequest
} from "@/api-client/models";

/**
 * Get all messages for a conversation
 */
export async function fetchMessages(conversationId: string): Promise<ChatMessageResponse[]> {
  const controller = await ControllerFactory.getChatMessageController();
  const response = await controller.getMessages({ conversationId });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch messages");
  }

  return response.data.result || [];
}

/**
 * Search messages in a conversation by keyword
 */
export async function searchMessages(
  conversationId: string,
  keyword: string
): Promise<ChatMessageResponse[]> {
  const controller = await ControllerFactory.getChatMessageController();
  const response = await controller.searchMessages({ conversationId, keyword });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to search messages");
  }

  return response.data.result || [];
}

/**
 * Delete a message by ID
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const controller = await ControllerFactory.getChatMessageController();
  const response = await controller.deleteMessage({ messageId });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to delete message");
  }
}

/**
 * Get conversations of current user
 */
export async function fetchMyConversations(): Promise<ConversationResponse[]> {
  const controller = await ControllerFactory.getConversationController();
  const response = await controller.myConversations();

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to fetch conversations");
  }

  return response.data.result || [];
}

/**
 * Create or retrieve a conversation
 */
export async function createConversation(
  conversationData: ConversationRequest
): Promise<ConversationResponse> {
  const controller = await ControllerFactory.getConversationController();
  const response = await controller.createConversation({ conversationRequest: conversationData });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to create conversation");
  }

  return response.data.result!;
}

/**
 * Search conversations by name
 */
export async function searchConversationsByName(name: string): Promise<ConversationResponse[]> {
  const controller = await ControllerFactory.getConversationController();
  const response = await controller.searchConversationsByName({ name });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Failed to search conversations");
  }

  return response.data.result || [];
}
