"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  MessageCircle,
  Send,
  Minus,
  Maximize2,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatWidgetStore } from "@/stores/chatWidgetStore";
import { useCustomerChat } from "@/hooks/useCustomerChat";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { ChatMessageResponse } from "@/api-client/models";
import { ChatMessageContent } from "../templates/admin/chat/ChatMessageContent";
import { MultiImageUpload } from "./MultiImageUpload";
import { uploadImagesAction } from "@/actions/fileActions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChatMessageProps {
  message: ChatMessageResponse;
  isCurrentUser: boolean;
}

function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender?.avatarUrl} />
          <AvatarFallback className="bg-gray-500 text-white text-xs">
            {message.sender?.name?.charAt(0) || "A"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          isCurrentUser
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-200 text-gray-800 rounded-bl-sm"
        )}
      >
        <ChatMessageContent content={message.message} />
        {message.createdDate && (
          <p
            className={cn(
              "text-xs mt-1 opacity-70",
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            )}
          >
            {formatTime(message.createdDate)}
          </p>
        )}
      </div>

      {isCurrentUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender?.avatarUrl} />
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {message.sender?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

// Floating Chat Button Component
function FloatingChatButton() {
  const { isAuthenticated } = useAuth();
  const { openWidget, unreadCount } = useChatWidgetStore();

  if (!isAuthenticated) return null;

  return (
    <Button
      onClick={openWidget}
      className="fixed bottom-6 right-6 z-50 bg-black hover:bg-gray-800 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-105"
    >
      <div className="relative">
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    </Button>
  );
}

export function CustomerChatWidget() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();
  const {
    isOpen,
    isMinimized,
    closeWidget,
    minimizeWidget,
    maximizeWidget,
    resetUnreadCount,
  } = useChatWidgetStore();

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

  // Use ref instead of state for message input
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // Fallback: scroll the container to bottom
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const uploadAndSendMutation = useMutation({
    mutationFn: async () => {
      if (selectedImages.length > 0) {
        const uploadResult = await uploadImagesAction(selectedImages);
        if (uploadResult.success && uploadResult.data) {
          return uploadResult.data;
        }
        throw new Error(uploadResult.message || "File upload failed");
      }
      return [];
    },
    onSuccess: (uploadedFiles: any[]) => {
      const messageInput = messageInputRef.current?.value || "";
      const fileUrls = uploadedFiles
        .map((file) => file.imageUrl)
        .filter((url) => url);
      const newMessage = messageInput + "\n" + fileUrls.join("  ");
      console.log(messageInput + "phungkovip");

      if (newMessage.trim()) {
        sendMessage(newMessage.trim());
      }

      // Clear the input using ref
      if (messageInputRef.current) {
        messageInputRef.current.value = "";
      }
      setSelectedImages([]);
      setShowUploader(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Handle sending message
  const handleSendMessage = async () => {
    const messageInput = messageInputRef.current?.value.trim() || "";

    if ((!messageInput && selectedImages.length === 0) || isSending) return;

    setIsSending(true);
    try {
      console.log(messageInput + "phungvip");

      uploadAndSendMutation.mutate();
      resetUnreadCount();
      // Scroll to bottom after sending
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle key down in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Check if message input has content (for button state)
  const hasMessageContent = () => {
    return (messageInputRef.current?.value.trim() || "").length > 0;
  };

  // Focus input and scroll when widget opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      if (messageInputRef.current) {
        setTimeout(() => messageInputRef.current?.focus(), 100);
      }
      // Scroll to bottom when opening
      setTimeout(scrollToBottom, 200);
    }
  }, [isOpen, isMinimized]);

  // Reset unread count when widget is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      resetUnreadCount();
    }
  }, [isOpen, isMinimized, resetUnreadCount]);

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render floating button if widget is closed
  if (!isOpen) {
    return <FloatingChatButton />;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border transition-all duration-300",
        isMinimized
          ? "w-80 h-14"
          : `w-96 ${showUploader ? "h-[600px]" : "h-[500px]"}`
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-white text-black text-xs font-semibold">
              AS
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Adam Store</h3>
            <p className="text-xs opacity-80 flex items-center gap-1">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isWebSocketConnected ? "bg-green-400" : "bg-red-400"
                )}
              />
              {isConnecting
                ? "Connecting..."
                : isWebSocketConnected
                ? t("Admin.chat.realTime")
                : t("Admin.chat.offline")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!isMinimized && (
            <Button
              variant="ghost"
              size="sm"
              onClick={minimizeWidget}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}

          {isMinimized && (
            <Button
              variant="ghost"
              size="sm"
              onClick={maximizeWidget}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={closeWidget}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content - only show when not minimized */}
      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-4 h-[380px] overflow-y-auto bg-gray-50"
            id="messages-container"
          >
            {isLoading || isConnecting ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    {isConnecting ? "Connecting..." : "Loading..."}
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm text-red-600 mb-2">Error: {error}</p>
                  <Button size="sm" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    {t("Admin.chat.noMessages")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("Admin.chat.noMessagesDescription")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={`${message.id}-${index}`}
                    message={message}
                    isCurrentUser={message.me || false}
                  />
                ))}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            )}
          </div>

          {/* Input Area */}
          {showUploader && <MultiImageUpload onChange={setSelectedImages} />}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowUploader(!showUploader)}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                ref={messageInputRef}
                onKeyDown={handleKeyDown}
                placeholder={t("Admin.chat.messagePlaceholder")}
                disabled={isSending || !isWebSocketConnected}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={
                  isSending ||
                  uploadAndSendMutation.isPending ||
                  !isWebSocketConnected
                }
                size="sm"
                className="bg-black hover:bg-gray-800"
              >
                {uploadAndSendMutation.isPending ? (
                  "..."
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
