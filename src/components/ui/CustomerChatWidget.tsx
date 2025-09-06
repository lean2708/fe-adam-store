'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { X, MessageCircle, Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatWidgetStore } from '@/stores/chatWidgetStore';
import { useCustomerChat } from '@/hooks/useCustomerChat';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { ChatMessageResponse } from '@/api-client/models';
import { ChatMessageContent } from '../templates/admin/chat/ChatMessageContent';
import { MultiImageUpload } from './MultiImageUpload';
import { uploadImagesAction } from '@/actions/fileActions';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// Memoized ChatMessage component
const ChatMessage = ({
  message,
  isCurrentUser,
}: {
  message: ChatMessageResponse;
  isCurrentUser: boolean;
}) => {
  // Memoize time formatting
  const formattedTime = useMemo(() => {
    if (!message.createdDate) return '';
    return new Date(message.createdDate).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [message.createdDate]);

  return (
    <div
      className={cn(
        'flex gap-2 mb-4',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isCurrentUser && (
        <Avatar className='w-8 h-8 shrink-0'>
          <AvatarImage src={message.sender?.avatarUrl} />
          <AvatarFallback className='bg-gray-500 text-white text-xs'>
            {message.sender?.name?.charAt(0) || 'A'}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-lg px-3 py-2 text-sm',
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-gray-200 text-gray-800 rounded-bl-sm'
        )}
      >
        <ChatMessageContent content={message.message} />
        {formattedTime && (
          <p
            className={cn(
              'text-xs mt-1 opacity-70',
              isCurrentUser ? 'text-blue-100' : 'text-gray-500'
            )}
          >
            {formattedTime}
          </p>
        )}
      </div>

      {isCurrentUser && (
        <Avatar className='w-8 h-8 shrink-0'>
          <AvatarImage src={message.sender?.avatarUrl} />
          <AvatarFallback className='bg-blue-500 text-white text-xs'>
            {message.sender?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

// Memoized Loading State
const LoadingState = ({ isConnecting }: { isConnecting: boolean }) => (
  <div className='flex items-center justify-center h-full'>
    <div className='text-center'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2' />
      <p className='text-sm text-gray-600'>
        {isConnecting ? 'Connecting...' : 'Loading...'}
      </p>
    </div>
  </div>
);

// Memoized Error State
const ErrorState = ({ error }: { error: string }) => (
  <div className='flex items-center justify-center h-full'>
    <div className='text-center'>
      <p className='text-sm text-red-600 mb-2'>Error: {error}</p>
      <Button size='sm' onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  </div>
);

// Memoized Empty State
const EmptyState = ({ t }: { t: any }) => (
  <div className='flex items-center justify-center h-full'>
    <div className='text-center'>
      <MessageCircle className='h-12 w-12 text-gray-400 mx-auto mb-2' />
      <p className='text-sm text-gray-600 mb-1'>{t('Admin.chat.noMessages')}</p>
      <p className='text-xs text-gray-500'>
        {t('Admin.chat.noMessagesDescription')}
      </p>
    </div>
  </div>
);

// Memoized Messages List
const MessagesList = ({
  messages,
  messagesEndRef,
}: {
  messages: ChatMessageResponse[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) => (
  <div className='space-y-1'>
    {messages.map((message, index) => (
      <ChatMessage
        key={`${message.id}-${index}`}
        message={message}
        isCurrentUser={message.me || false}
      />
    ))}
    <div ref={messagesEndRef} className='h-1' />
  </div>
);

export function CustomerChatWidget() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();
  const { isOpen, isMinimized, minimizeWidget, resetUnreadCount } =
    useChatWidgetStore();
  const { openWidget } = useChatWidgetStore();

  const handleChatClick = () => {
    if (isAuthenticated) {
      openWidget();
    } else {
      toast.info('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục');
    }
  };
  const {
    messages,
    isLoading,
    isConnecting,
    isWebSocketConnected,
    error,
    sendMessage,
    messagesEndRef,
  } = useCustomerChat();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Memoized scroll function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesEndRef]);

  // Optimized upload mutation
  const uploadAndSendMutation = useMutation({
    mutationFn: async () => {
      if (selectedImages.length === 0) return [];

      const uploadResult = await uploadImagesAction(selectedImages);
      if (uploadResult.success && uploadResult.data) {
        return uploadResult.data;
      }
      throw new Error(uploadResult.message || 'File upload failed');
    },
    onSuccess: (uploadedFiles: any[]) => {
      const messageText = messageInputRef.current?.value?.trim() || '';
      const fileUrls = uploadedFiles
        .map((file) => file.imageUrl)
        .filter(Boolean);

      const fullMessage =
        messageText + (fileUrls.length > 0 ? '\n' + fileUrls.join('  ') : '');

      if (fullMessage.trim()) {
        sendMessage(fullMessage.trim());
        resetUnreadCount();
        setTimeout(scrollToBottom, 100);
      }

      // Clear form
      if (messageInputRef.current) {
        messageInputRef.current.value = '';
      }
      setSelectedImages([]);
      setShowUploader(false);
      setIsSending(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setIsSending(false);
    },
  });

  // Optimized send message handler
  const handleSendMessage = useCallback(async () => {
    const messageText = messageInputRef.current?.value?.trim() || '';

    if ((!messageText && selectedImages.length === 0) || isSending) return;

    setIsSending(true);
    uploadAndSendMutation.mutate();
  }, [selectedImages.length, isSending, uploadAndSendMutation]);

  // Optimized key handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Optimized uploader toggle
  const toggleUploader = useCallback(() => {
    setShowUploader((prev) => !prev);
  }, []);

  // Focus and scroll effects
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => {
        messageInputRef.current?.focus();
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized, scrollToBottom, showUploader]);

  // Reset unread count effect
  useEffect(() => {
    if (isOpen && !isMinimized) {
      resetUnreadCount();
    }
  }, [isOpen, isMinimized, resetUnreadCount]);

  // Memoized connection status
  const connectionStatus = useMemo(() => {
    if (isConnecting) return 'Connecting...';
    return isWebSocketConnected
      ? t('Admin.chat.realTime')
      : t('Admin.chat.offline');
  }, [isConnecting, isWebSocketConnected, t]);

  // Memoized widget dimensions

  // Early returns
  if (!isAuthenticated) return null;

  if (!isMinimized) {
    return (
      <div
        className={cn(
          'fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-border transition-all duration-300 flex flex-col overflow-hidden',
          // Mobile styles (default)
          'w-[calc(100vw-2rem)] max-w-[320px] max-h-[400px]',
          // Tablet styles
          'sm:w-80 sm:max-h-[420px]',
          // Desktop styles
          'md:w-96 md:max-h-[480px]',
          // Large desktop
          'lg:w-[400px] lg:max-h-[520px]'
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white shrink-0'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='relative'>
              <Avatar className='w-10 h-10 shrink-0 ring-2 ring-white/20'>
                <AvatarFallback className='bg-white text-blue-600 text-sm font-bold'>
                  AS
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                  isWebSocketConnected ? 'bg-green-400' : 'bg-gray-400'
                )}
              />
            </div>
            <div className='min-w-0 flex-1'>
              <h3 className='font-semibold text-base truncate'>Adam Store</h3>
              <p className='text-xs text-blue-100 truncate'>
                {connectionStatus}
              </p>
            </div>
          </div>

          <Button
            variant='ghost'
            size='sm'
            onClick={minimizeWidget}
            className='h-8 w-8 p-0 text-white hover:bg-white/10 rounded-full shrink-0 transition-colors'
            aria-label='Minimize chat'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className='flex-1 p-3 overflow-y-auto bg-gray-50 min-h-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500'
          id='messages-container'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#9ca3af #e5e7eb',
          }}
        >
          {isLoading || isConnecting ? (
            <LoadingState isConnecting={isConnecting} />
          ) : error ? (
            <ErrorState error={error} />
          ) : messages.length === 0 ? (
            <EmptyState t={t} />
          ) : (
            <MessagesList messages={messages} messagesEndRef={messagesEndRef} />
          )}
        </div>

        {/* Uploader */}
        {showUploader && (
          <div className='shrink-0 border-t border-gray-200 bg-white p-3'>
            <MultiImageUpload onChange={setSelectedImages} />
          </div>
        )}

        {/* Input Area */}
        <div className='p-3 bg-white border-t border-gray-200 shrink-0'>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full p-2 shrink-0 transition-colors'
              onClick={toggleUploader}
              aria-label='Toggle file upload'
            >
              <Paperclip className='h-5 w-5' />
            </Button>

            <div className='flex-1 relative'>
              <Input
                ref={messageInputRef}
                onKeyDown={handleKeyDown}
                placeholder={t('Admin.chat.messagePlaceholder')}
                disabled={isSending || !isWebSocketConnected}
                className='flex-1 text-black min-w-0 bg-gray-100 border-0 rounded-full px-4 py-2.5 text-sm placeholder:text-gray-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 transition-all resize-none'
                style={{ minHeight: '40px' }}
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={
                isSending ||
                uploadAndSendMutation.isPending ||
                !isWebSocketConnected
              }
              size='sm'
              className={cn(
                'rounded-full p-2.5 shrink-0 transition-all duration-200',
                isSending ||
                  uploadAndSendMutation.isPending ||
                  !isWebSocketConnected
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
              )}
              aria-label='Send message'
            >
              {uploadAndSendMutation.isPending ? (
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                <Send className='h-5 w-5 text-white' />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleChatClick}
      className='fixed bottom-6 right-6 z-50 group
          bg-gradient-to-r from-blue-600 to-blue-700 
          hover:from-blue-700 hover:to-blue-800 
          text-white rounded-full px-6 py-4 
          shadow-xl hover:shadow-2xl
          transform transition-all  ease-out
          hover:scale-105 hover:-translate-y-1
          animate-in slide-in-from-bottom-8 fade-in duration-500
          border border-blue-500/20
          backdrop-blur-sm
          flex items-center gap-3
          min-w-[140px] justify-center
          active:scale-95 active:shadow-lg
          before:absolute before:inset-0 before:rounded-full 
          before:bg-white/10 before:opacity-0 before:transition-opacity 
          hover:before:opacity-100'
    >
      <MessageCircle className='h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110' />
      <span className='font-medium text-sm tracking-wide'>
        {t('chatwithus')}
      </span>

      <div className='absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping opacity-75'></div>
      <div className='absolute inset-0 rounded-full border border-blue-300/30 animate-pulse'></div>
    </Button>
  );
}
