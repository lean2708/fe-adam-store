"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Send, Paperclip, Smile } from "lucide-react";
import type { TConversation } from "@/types";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
import { uploadImagesAction } from "@/actions/fileActions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChatInputProps {
  conversation: TConversation | null;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isWebSocketConnected?: boolean;
  showUploader: boolean;
  setShowUploader: (show: boolean) => void;
}

export function ChatInput({
  conversation,
  onSendMessage,
  disabled = false,
  isWebSocketConnected = true,
  showUploader,
  setShowUploader,
}: ChatInputProps) {
  const t = useTranslations("Admin.chat");
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

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
      const fileUrls = uploadedFiles
        .map((file) => file.imageUrl)
        .filter((url) => url);
      const newMessage = message.trim() + "\n" + fileUrls.join("  ");

      if (newMessage.trim()) {
        onSendMessage(newMessage.trim());
      }

      setMessage("");
      setSelectedImages([]);
      setShowUploader(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSendMessage = () => {
    if (
      (!message.trim() && selectedImages.length === 0) ||
      !conversation?.id ||
      disabled
    ) {
      return;
    }
    uploadAndSendMutation.mutate();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isDisabled =
    disabled ||
    !conversation?.id ||
    !isWebSocketConnected ||
    uploadAndSendMutation.isPending;

  return (
    <div>
      {showUploader && <MultiImageUpload onChange={setSelectedImages} />}
      <div className="p-4 border-t bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2 dark:bg-gray-900">
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={isDisabled}
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowUploader(!showUploader)}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Message input */}
          <div className="flex-1 relative">
            <Input
              placeholder={
                !conversation
                  ? t("selectConversationFirst") ||
                    "Chọn cuộc trò chuyện để bắt đầu..."
                  : !isWebSocketConnected
                  ? t("websocketNotConnected") || "WebSocket chưa kết nối"
                  : t("messagePlaceholder") || "Nhập tin nhắn..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isDisabled}
              className="pr-20"
            />

            {/* Emoji button */}
            <Button
              variant="ghost"
              size="sm"
              disabled={isDisabled}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
            >
              <Smile className="h-4 w-4" />
            </Button>

            {/* Send button */}
            <Button
              onClick={handleSendMessage}
              disabled={
                (!message.trim() && selectedImages.length === 0) || isDisabled
              }
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              {uploadAndSendMutation.isPending ? (
                "..."
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Status messages */}
        {!isWebSocketConnected && (
          <p className="text-xs text-red-500 mt-2 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            {t("websocketNotConnected") || "WebSocket chưa kết nối"}
          </p>
        )}

        {!conversation && isWebSocketConnected && (
          <p className="text-xs text-gray-500 mt-2">
            {t("selectConversationToStart") ||
              "Chọn cuộc trò chuyện để bắt đầu nhắn tin"}
          </p>
        )}

        {conversation && isWebSocketConnected && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              {t("chatWith") || "Đang chat với"}{" "}
              {conversation.participants?.find((p) => p.userId !== 1)?.name ||
                t("unknownCustomer") ||
                "Khách hàng không rõ"}
            </p>

            {/* Typing indicator could go here */}
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">
                {t("connected") || "Đã kết nối"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
