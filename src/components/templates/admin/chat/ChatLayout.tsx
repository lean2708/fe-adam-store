'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/admin/useChat';
import { useAuth } from '@/hooks/useAuth';
import { ChatHeader } from './ChatHeader';
import { ConversationsList } from './ConversationsList';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import useIsMobile from '@/hooks/useIsMobile';

export function ChatLayout() {
  const { user: currentUser } = useAuth();
  const [showUploader, setShowUploader] = useState(false);
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'conversations' | 'chat'>(
    'conversations'
  );

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

  // Auto switch to chat view when conversation is selected on mobile
  useEffect(() => {
    if (isMobile && selectedConversation) {
      setMobileView('chat');
    }
  }, [selectedConversation, isMobile]);

  const handleConversationSelectMobile = (conversation: any) => {
    handleConversationSelect(conversation);
    if (isMobile) {
      setMobileView('chat');
    }
  };

  const handleBackToConversations = () => {
    setMobileView('conversations');
  };

  const showConversationsList =
    !isMobile || (isMobile && mobileView === 'conversations');
  const showChatArea = !isMobile || (isMobile && mobileView === 'chat');

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='admin-page-container space-y-6 dark:bg-gray-900'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm border p-4 md:p-6 dark:bg-gray-900'>
          <ChatHeader
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            isWebSocketConnected={isWebSocketConnected}
            conversationsCount={conversations.length}
            loading={conversationsLoading}
            onCreateConversation={() => handleCreateConversation([2], 'DIRECT')}
          />
        </div>

        {/* Main Chat Interface */}
        <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
          <div className={`flex ${showUploader ? 'h-[700px]' : 'h-[650px]'}`}>
            {/* Conversations Sidebar - Hidden on mobile when in chat view */}
            {showConversationsList && (
              <div className='w-full sm:w-80 border-r bg-gray-50 dark:bg-gray-900'>
                <ConversationsList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  loading={conversationsLoading}
                  onConversationSelect={handleConversationSelectMobile}
                  onRefresh={handleRefreshConversations}
                  error={conversationsError}
                  currentUser={currentUser}
                  isWebSocketConnected={isWebSocketConnected}
                />
              </div>
            )}

            {/* Chat Area - Hidden on mobile when in conversations view */}
            {showChatArea && (
              <div className='flex-1 flex flex-col dark:bg-gray-900'>
                {/* Mobile header for chat view */}
                {isMobile && (
                  <div className='flex items-center p-4 border-b bg-white dark:bg-gray-900'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleBackToConversations}
                      className='mr-2'
                    >
                      <ArrowLeft className='h-4 w-4' />
                    </Button>
                    <div className='flex items-center'>
                      <MessageCircle className='h-4 w-4 mr-2' />
                      <span className='font-medium'>Trò chuyện</span>
                    </div>
                  </div>
                )}

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
