"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import {
  RefreshCw,
  Search,
  Wifi,
  WifiOff,
  MessageCircle,
  Plus,
} from "lucide-react";

interface ChatHeaderProps {
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isWebSocketConnected: boolean;
  conversationsCount: number;
  loading?: boolean;
  onCreateConversation?: () => void;
}

export function ChatHeader({
  onRefresh,
  searchTerm,
  onSearchChange,
  isWebSocketConnected,
  conversationsCount,
  loading = false,
  onCreateConversation,
}: ChatHeaderProps) {
  const t = useTranslations("Admin.chat");

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Search is handled by the parent component through onSearchChange
    }
  };

  return (
    <div className="space-y-4 dark:bg-gray-900">
      {/* Title and Actions */}
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("title") || "Quản lý Chat"}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("description") ||
              "Quản lý cuộc trò chuyện và tin nhắn với khách hàng"}
          </p>
        </div>
        {/* <div className="flex gap-3">
          {onCreateConversation && (
            <Button
              onClick={onCreateConversation}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("createConversation") || "Tạo cuộc trò chuyện"}
            </Button>
          )}
          <Button
            onClick={onRefresh}
            variant="outline"
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t("refresh") || "Refresh"}
          </Button>
        </div> */}
      </div>

      {/* Search and Status */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={
              t("searchPlaceholder") || "Tìm kiếm cuộc trò chuyện..."
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <Badge
            variant={isWebSocketConnected ? "default" : "secondary"}
            className={
              isWebSocketConnected
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {isWebSocketConnected ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                {t("connected") || "Đã kết nối"}
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                {t("disconnected") || "Mất kết nối"}
              </>
            )}
          </Badge>

          {/* Conversations Count */}
          <Badge variant="outline" className="bg-white  dark:bg-black">
            <MessageCircle className="h-3 w-3 mr-1" />
            {conversationsCount} {t("conversations") || "cuộc trò chuyện"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
