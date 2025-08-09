/**
 * Chat Mock Data Demonstration
 * 
 * This file demonstrates how to fetch data from the mock chat system
 */

import {
  fetchMyConversationsAction,
  fetchMessagesAction,
  searchConversationsByNameAction
} from "@/actions/chatActions";
import { shouldUseChatMockData } from "@/lib/config/mock-data";

/**
 * Demo function to show how mock data fetching works
 */
export async function demonstrateMockDataFetching() {
  console.log("🚀 Starting Chat Mock Data Demonstration");
  console.log("📊 Mock data enabled:", shouldUseChatMockData());
  
  try {
    // 1. Fetch all conversations
    console.log("\n1️⃣ Fetching all conversations...");
    const conversationsResult = await fetchMyConversationsAction();
    
    if (conversationsResult.success && conversationsResult.data) {
      console.log(`✅ Successfully fetched ${conversationsResult.data.length} conversations`);
      console.log("📋 Conversations:", conversationsResult.data.map(conv => ({
        id: conv.id,
        name: conv.participants?.[1]?.name || "Unknown",
        type: conv.type,
        participantCount: conv.participants?.length || 0
      })));
      
      // 2. Fetch messages for the first conversation
      const firstConv = conversationsResult.data[0];
      if (firstConv?.id) {
        console.log(`\n2️⃣ Fetching messages for conversation: ${firstConv.participants?.[1]?.name}`);
        const messagesResult = await fetchMessagesAction(firstConv.id);
        
        if (messagesResult.success && messagesResult.data) {
          console.log(`✅ Successfully fetched ${messagesResult.data.length} messages`);
          console.log("💬 Sample messages:", messagesResult.data.map(msg => ({
            id: msg.id,
            sender: msg.sender?.name,
            isAdmin: msg.me,
            preview: msg.message?.substring(0, 50) + "...",
            timestamp: msg.createdDate
          })));
        }
      }
      
      // 3. Search conversations
      console.log("\n3️⃣ Searching conversations for 'Người dùng'...");
      const searchResult = await searchConversationsByNameAction("Người dùng");
      
      if (searchResult.success && searchResult.data) {
        console.log(`✅ Found ${searchResult.data.length} matching conversations`);
        console.log("🔍 Search results:", searchResult.data.map(conv => ({
          id: conv.id,
          name: conv.participants?.[1]?.name || "Unknown"
        })));
      }
      
    } else {
      console.error("❌ Failed to fetch conversations:", conversationsResult.message);
    }
    
  } catch (error) {
    console.error("💥 Error during demonstration:", error);
  }
  
  console.log("\n🏁 Mock data demonstration completed!");
}

/**
 * Quick test function to verify mock data is working
 */
export async function quickMockTest() {
  console.log("⚡ Quick Mock Data Test");
  
  try {
    const result = await fetchMyConversationsAction();
    
    if (result.success && result.data) {
      console.log(`✅ Mock data is working! Found ${result.data.length} conversations`);
      return {
        success: true,
        conversationCount: result.data.length,
        sampleConversation: result.data[0]
      };
    } else {
      console.log("❌ Mock data test failed:", result.message);
      return {
        success: false,
        error: result.message
      };
    }
  } catch (error) {
    console.log("💥 Mock data test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Function to demonstrate Vietnamese conversation content
 */
export async function showVietnameseConversations() {
  console.log("🇻🇳 Vietnamese Conversation Demo");
  
  try {
    const conversationsResult = await fetchMyConversationsAction();
    
    if (conversationsResult.success && conversationsResult.data) {
      // Get messages from first few conversations
      for (let i = 0; i < Math.min(3, conversationsResult.data.length); i++) {
        const conv = conversationsResult.data[i];
        if (conv.id) {
          console.log(`\n💬 Conversation with ${conv.participants?.[1]?.name}:`);
          
          const messagesResult = await fetchMessagesAction(conv.id);
          if (messagesResult.success && messagesResult.data) {
            messagesResult.data.forEach(msg => {
              const speaker = msg.me ? "👨‍💼 Admin" : "👤 Customer";
              console.log(`${speaker}: ${msg.message}`);
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error showing Vietnamese conversations:", error);
  }
}

/**
 * Export all demo functions
 */
export const chatMockDemo = {
  demonstrateMockDataFetching,
  quickMockTest,
  showVietnameseConversations
};
