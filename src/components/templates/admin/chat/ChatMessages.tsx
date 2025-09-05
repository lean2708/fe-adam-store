"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { MessageCircle, Trash2, MoreVertical } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { TConversation, TChatMessage, TUser } from "@/types";
import { ChatMessageContent } from "./ChatMessageContent";

interface ChatMessagesProps {
  conversation: TConversation | null;
  messages: TChatMessage[];
  loading: boolean;
  onDeleteMessage: (messageId: string) => void;
  error?: Error | null;
  onRefresh?: () => void;
  currentUser?: TUser | null;
  showUploader?: boolean;
}

export function ChatMessages({
  conversation,
  messages,
  loading,
  onDeleteMessage,
  error,
  onRefresh,
  currentUser,
  showUploader,
}: ChatMessagesProps) {
  const t = useTranslations("Admin.chat");
  const locale = useLocale();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showUploader]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">
            {t("selectConversation") || "Chọn một cuộc trò chuyện"}
          </p>
          <p className="text-sm">
            {t("selectConversationDescription") ||
              "Chọn cuộc trò chuyện từ danh sách bên trái để bắt đầu"}
          </p>
        </div>
      </div>
    );
  }

  // Find the other participant (not the current user)
  const otherParticipant = conversation.participants?.find(
    (p) => Number(p.userId) !== Number(currentUser?.id)
  );
  const otherParticipantName =
    otherParticipant?.name || t("unknownCustomer") || "Khách hàng không rõ";

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white dark:bg-black">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="flex-1 p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {i % 2 === 0 && (
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
              )}
              <div className="flex-1 max-w-xs">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-red-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">
            {t("messagesLoadError") || "Lỗi khi tải tin nhắn"}
          </p>
          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          {onRefresh && (
            <Button onClick={onRefresh} size="sm" className="mt-3">
              {t("refresh") || "Thử lại"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  otherParticipant?.avatarUrl || conversation.conversationAvatar
                }
                alt={otherParticipantName}
              />
              <AvatarFallback className="bg-gray-200 text-gray-600 dark:text-white">
                {otherParticipantName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {otherParticipantName}
              </h3>
              <div className="flex items-center space-x-2">
                {/* <div className="w-2 h-2 bg-green-400 rounded-full"></div> */}
                <p className="text-sm text-gray-500">
                  {/* {t("online") || "Trực tuyến"} • {conversation.type === 'DIRECT'
                    ? (t("directMessage") || "Tin nhắn trực tiếp")
                    : (t("groupChat") || "Nhóm chat")
                  } */}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button onClick={onRefresh} variant="ghost" size="sm">
                {t("refresh") || "Tải lại"}
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 max-h-[400px] overflow-y-auto">
        <div className="p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium">
                {t("noMessages") || "Chưa có tin nhắn nào"}
              </p>
              <p className="text-xs mt-1">
                {t("noMessagesDescription") ||
                  "Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                // Check if message is from current user
                const isCurrentUser = message.me;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage
                          src={otherParticipant?.avatarUrl}
                          alt={otherParticipant?.name || "User"}
                        />
                        <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                          {(otherParticipant?.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-xs lg:max-w-md ${
                        isCurrentUser ? "ml-12" : "mr-12"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl relative group ${
                          isCurrentUser
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-gray-200 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <ChatMessageContent content={message.message} />

                        {/* Delete button for current user messages */}
                        {isCurrentUser && (
                          <button
                            onClick={() => onDeleteMessage(message.id ?? "")}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            title={t("actions.delete") || "Xóa tin nhắn"}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      <div
                        className={`flex items-center mt-1 space-x-1 ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <p className="text-xs text-gray-500">
                          {formatDate(message.createdDate, locale)}
                        </p>
                        {isCurrentUser && (
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {isCurrentUser && (
                      <Avatar className="h-8 w-8 ml-2 mt-1">
                        <AvatarImage
                          src={
                            currentUser?.avatarUrl ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                          }
                          alt={currentUser?.name || "Current User"}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {(currentUser?.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
