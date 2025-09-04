"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/admin/useChat";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { ConversationsList } from "./ConversationsList";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";

export function ChatLayout() {
  const { user: currentUser } = useAuth();
  const [showUploader, setShowUploader] = useState(false);


  const {
    // Data
    conversations,
    messages,
    selectedConversation,
    searchTerm,

    // Loading states
    conversationsLoading,
    messagesLoading,

    // Error states
    conversationsError,
    messagesError,

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
  } = useChat();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="admin-page-container space-y-6 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-900">
          <ChatHeader
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            isWebSocketConnected={isWebSocketConnected}
            conversationsCount={conversations.length}
            loading={conversationsLoading}
            onCreateConversation={() => handleCreateConversation([2], "DIRECT")}
          />
        </div>

        {/* Main Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className={`flex ${showUploader ? "h-[700px]" : "h-[600px]"}`}>
            {/* Conversations Sidebar */}
            <div className="w-80 border-r bg-gray-50  dark:bg-gray-900">
              <ConversationsList
                conversations={conversations}
                selectedConversation={selectedConversation}
                loading={conversationsLoading}
                onConversationSelect={handleConversationSelect}
                onRefresh={handleRefreshConversations}
                error={conversationsError}
                currentUser={currentUser}
                isWebSocketConnected={isWebSocketConnected}
              />
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col dark:bg-gray-900">
              <ChatMessages
                conversation={selectedConversation}
                messages={messages}
                loading={messagesLoading}
                onDeleteMessage={handleDeleteMessage}
                error={messagesError}
                onRefresh={handleRefreshMessages}
                currentUser={currentUser}
                showUploader={showUploader}
              />

              <ChatInput
                conversation={selectedConversation}
                onSendMessage={handleSendMessage}
                disabled={messagesLoading}
                isWebSocketConnected={isWebSocketConnected}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
