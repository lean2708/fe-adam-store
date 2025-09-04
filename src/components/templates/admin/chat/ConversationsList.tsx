"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MessageCircle, Users } from "lucide-react";
import type { TConversation, TUser } from "@/types";

interface ConversationsListProps {
  conversations: TConversation[];
  selectedConversation: TConversation | null;
  loading: boolean;
  onConversationSelect: (conversation: TConversation) => void;
  onRefresh?: () => void;
  error?: Error | null;
  currentUser?: TUser | null;
  isWebSocketConnected?: boolean;
}

export function ConversationsList({
  conversations,
  selectedConversation,
  loading,
  onConversationSelect,
  onRefresh,
  error,
  currentUser,
  isWebSocketConnected,
}: ConversationsListProps) {
  const t = useTranslations("Admin.chat");

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">
            <Skeleton className="h-5 w-32" />
          </h3>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">
          <MessageCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm font-medium">
            {t("conversationLoadError") || "Lỗi khi tải cuộc trò chuyện"}
          </p>
          <p className="text-xs text-gray-500 mt-1">{error.message}</p>
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} size="sm" variant="outline">
            {t("refresh") || "Thử lại"}
          </Button>
        )}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 ">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300 " />
        <p className="text-sm font-medium">
          {t("noConversations") || "Chưa có cuộc trò chuyện nào"}
        </p>
        <p className="text-xs mt-1">
          {t("noConversationsDescription") ||
            "Cuộc trò chuyện sẽ xuất hiện khi khách hàng gửi tin nhắn"}
        </p>
        {onRefresh && (
          <Button onClick={onRefresh} size="sm" className="mt-3">
            {t("refresh") || "Tải lại"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 flex items-center dark:text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("conversations") || "Cuộc trò chuyện"} ({conversations.length})
          </h3>
          {onRefresh && (
            <Button onClick={onRefresh} size="sm" variant="ghost">
              {t("refresh") || "Tải lại"}
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.map((conversation) => {
            // Find the other participant (not the current user)
            const otherParticipant = conversation.participants?.find(
              (p) => Number(p.userId) !== Number(currentUser?.id)
            );
            const participantName =
              otherParticipant?.name ||
              t("unknownCustomer") ||
              "Khách hàng không rõ";
            const isSelected = selectedConversation?.id === conversation.id;

            return (
              <div
                key={conversation.id}
                className={`flex items-center space-x-3 p-3  rounded-lg transition-colors ${
                  !isWebSocketConnected
                    ? "opacity-50 cursor-not-allowed"
                    : isSelected
                    ? "bg-blue-50 border border-blue-200 cursor-pointer dark:bg-blue-900 dark:border-blue-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
                }`}
                onClick={() =>
                  isWebSocketConnected && onConversationSelect(conversation)
                }
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        otherParticipant?.avatarUrl ||
                        conversation.conversationAvatar
                      }
                      alt={participantName}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {participantName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Online status indicator */}
                  {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div> */}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {participantName}
                    </p>
                    {conversation.type === "GROUP" && (
                      <Users className="h-3 w-3 text-gray-400" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {conversation.type === "DIRECT"
                        ? t("directMessage") || "Tin nhắn trực tiếp"
                        : `${conversation.participants?.length || 0} ${
                            t("members") || "thành viên"
                          }`}
                    </p>

                    {/* Last message time or unread count could go here */}
                    <div className="flex items-center space-x-1">
                      {/* {isSelected && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
