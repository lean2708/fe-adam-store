"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Search,
  Send,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Info
} from "lucide-react";
import {
  fetchMyConversationsAction,
  fetchMessagesAction,
  searchConversationsByNameAction
} from "@/actions/chatActions";
import { getMockConversations, getMockMessages } from "@/lib/mock-data/chat";
import type { ConversationResponse, ChatMessageResponse } from "@/api-client/models";
import { formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function ChatAdminPage() {
  const locale = useLocale();
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log mock data usage for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🎯 Chat page loaded - using mock data");
      console.log("📊 Expected: 9 Vietnamese customer conversations");

      // Test mock data directly
      import("@/lib/mock-data/chat").then(({ getMockConversations }) => {
        const mockConvs = getMockConversations();
        console.log("🧪 Direct mock data test:", mockConvs.length, "conversations");
        console.log("🧪 Mock conversations:", mockConvs);
      });

      // Test mock configuration
      import("@/lib/config/mock-data").then(({ shouldUseChatMockData }) => {
        const useMock = shouldUseChatMockData();
        console.log("⚙️ Should use mock data:", useMock);
      });
    }
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      console.log("🔄 Loading conversations...");
      const result = await fetchMyConversationsAction();
      console.log("📊 Conversations result:", result);

      if (result.success && result.data) {
        console.log("✅ Successfully loaded conversations:", result.data.length);
        setConversations(result.data);
        // Auto-select first conversation if none selected
        if (!selectedConversation && result.data.length > 0) {
          handleConversationSelect(result.data[0]);
        }
        toast.success(`Đã tải ${result.data.length} cuộc trò chuyện từ mock data!`);
      } else {
        console.error("❌ Failed to load conversations via actions, trying direct mock data...");
        // Fallback to direct mock data
        const mockConversations = getMockConversations();
        if (mockConversations.length > 0) {
          console.log("✅ Loaded conversations directly from mock data:", mockConversations.length);
          setConversations(mockConversations);
          if (!selectedConversation) {
            handleConversationSelect(mockConversations[0]);
          }
          toast.success(`Đã tải ${mockConversations.length} cuộc trò chuyện từ mock data!`);
        } else {
          toast.error("Không thể tải cuộc trò chuyện");
        }
      }
    } catch (error) {
      console.error("💥 Error loading conversations:", error);
      // Fallback to direct mock data
      try {
        const mockConversations = getMockConversations();
        if (mockConversations.length > 0) {
          console.log("✅ Fallback: Loaded conversations directly from mock data:", mockConversations.length);
          setConversations(mockConversations);
          if (!selectedConversation) {
            handleConversationSelect(mockConversations[0]);
          }
          toast.success(`Đã tải ${mockConversations.length} cuộc trò chuyện từ mock data!`);
        } else {
          toast.error("Lỗi khi tải cuộc trò chuyện");
        }
      } catch (mockError) {
        console.error("💥 Even mock data failed:", mockError);
        toast.error("Lỗi khi tải cuộc trò chuyện");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      console.log("🔄 Loading messages for conversation:", conversationId);
      const result = await fetchMessagesAction(conversationId);
      if (result.success && result.data) {
        console.log("✅ Successfully loaded messages:", result.data.length);
        setMessages(result.data);
      } else {
        console.error("❌ Failed to load messages via actions, trying direct mock data...");
        // Fallback to direct mock data
        const mockMessages = getMockMessages(conversationId);
        if (mockMessages.length > 0) {
          console.log("✅ Loaded messages directly from mock data:", mockMessages.length);
          setMessages(mockMessages);
        } else {
          toast.error("Không thể tải tin nhắn");
        }
      }
    } catch (error) {
      console.error("💥 Error loading messages:", error);
      // Fallback to direct mock data
      try {
        const mockMessages = getMockMessages(conversationId);
        if (mockMessages.length > 0) {
          console.log("✅ Fallback: Loaded messages directly from mock data:", mockMessages.length);
          setMessages(mockMessages);
        } else {
          toast.error("Không thể tải tin nhắn");
        }
      } catch (mockError) {
        console.error("💥 Even mock messages failed:", mockError);
        toast.error("Lỗi khi tải tin nhắn");
      }
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleConversationSelect = (conversation: ConversationResponse) => {
    setSelectedConversation(conversation);
    if (conversation.id) {
      loadMessages(conversation.id);
    }
  };

  const handleSearchConversations = async () => {
    if (!searchTerm.trim()) {
      loadConversations();
      return;
    }

    setLoading(true);
    try {
      const result = await searchConversationsByNameAction(searchTerm);
      if (result.success && result.data) {
        setConversations(result.data);
      } else {
        toast.error(result.message || "Failed to search conversations");
      }
    } catch {
      toast.error("Failed to search conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation?.id) return;

    // Add admin message to local state (simulating real-time chat)
    const adminMessage: ChatMessageResponse = {
      id: `admin-${Date.now()}`,
      conversationId: selectedConversation.id,
      me: true,
      message: newMessage.trim(),
      sender: {
        userId: 1,
        name: "Admin Support",
        email: "admin@adamstore.com",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      createdDate: new Date().toISOString()
    };

    setMessages(prev => [...prev, adminMessage]);
    setNewMessage("");

    toast.success("Tin nhắn đã gửi!");

    // Simulate customer response after 2-3 seconds (for demo purposes)
    if (Math.random() > 0.3) { // 70% chance of auto-response
      setTimeout(() => {
        const customer = selectedConversation.participants?.find(p => p.userId !== 1);
        const responses = [
          "Cảm ơn admin đã hỗ trợ ạ!",
          "Em hiểu rồi, cảm ơn nhiều!",
          "OK admin, em sẽ làm theo hướng dẫn.",
          "Dạ, em đã nhận được thông tin rồi ạ.",
          "Cảm ơn admin rất nhiều!",
          "Tuyệt vời, vấn đề đã được giải quyết!"
        ];

        const customerResponse: ChatMessageResponse = {
          id: `customer-${Date.now()}`,
          conversationId: selectedConversation.id,
          me: false,
          message: responses[Math.floor(Math.random() * responses.length)],
          sender: customer || {
            userId: 12345,
            name: "Người dùng 12345",
            email: "user@example.com"
          },
          createdDate: new Date().toISOString()
        };

        setMessages(prev => [...prev, customerResponse]);
      }, 2000 + Math.random() * 2000); // 2-4 seconds delay
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
            <div className="flex items-center space-x-2">
              {process.env.NODE_ENV === 'development' && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mock Data</span>
                </div>
              )}
              <Button
                onClick={() => {
                  console.log("🔄 Force loading conversations...");
                  loadConversations();
                }}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Tải lại
              </Button>
            </div>
          </div>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm trực tiếp"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchConversations()}
              className="pl-10 bg-gray-100 border-0 focus:bg-white"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium px-3 py-2">
              Tìm kiếm trực tiếp
            </p>
            {loading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Không tìm thấy cuộc trò chuyện nào</p>
                <p className="text-xs mt-1">Dữ liệu sẽ tự động tải từ mock data</p>
                <Button
                  onClick={loadConversations}
                  size="sm"
                  className="mt-3"
                  disabled={loading}
                >
                  {loading ? "Đang tải..." : "Tải lại cuộc trò chuyện"}
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => {
                  // Get the customer (non-admin) participant
                  const customer = conversation.participants?.find(p => p.userId !== 1);
                  const customerName = customer?.name || "Người dùng 12345";

                  return (
                    <div
                      key={conversation.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={customer?.avatarUrl || conversation.conversationAvatar}
                          alt={customerName}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {customerName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conversation.type === 'DIRECT' ? 'Trò chuyện trực tiếp' : `${conversation.participants?.length || 0} thành viên`}
                        </p>
                      </div>
                      {/* Online status indicator */}
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium">Chọn cuộc trò chuyện</p>
              <p className="text-sm">Chọn một cuộc trò chuyện để bắt đầu chat</p>
              {conversations.length === 0 && !loading && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-blue-700">
                    💡 Dữ liệu mock đang được tải tự động
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Hệ thống sẽ hiển thị 9 cuộc trò chuyện mẫu với khách hàng
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const customer = selectedConversation.participants?.find(p => p.userId !== 1);
                  const customerName = customer?.name || "Người dùng 12345";

                  return (
                    <>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={customer?.avatarUrl || selectedConversation.conversationAvatar}
                          alt={customerName}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {customerName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {customerName}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <p className="text-sm text-gray-500">
                            Đang hoạt động • {selectedConversation.type === 'DIRECT' ? 'Trò chuyện trực tiếp' : 'Nhóm'}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full mr-2" />}
                      <div className="flex-1 max-w-xs">
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-3 w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="text-sm">Chưa có tin nhắn nào</p>
                  <p className="text-xs mt-1">Bắt đầu cuộc trò chuyện với khách hàng!</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg max-w-sm mx-auto">
                    <p className="text-xs text-blue-700">
                      💡 Tin nhắn mẫu sẽ tự động tải từ mock data
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isAdmin = message.me;
                    const customer = selectedConversation.participants?.find(p => p.userId !== 1);

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isAdmin && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage src={customer?.avatarUrl} alt={customer?.name || "User"} />
                            <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                              {(customer?.name || "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className={`max-w-xs lg:max-w-md ${isAdmin ? 'ml-12' : 'mr-12'}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              isAdmin
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-gray-200 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.message}</p>
                          </div>
                          <div className={`flex items-center mt-1 space-x-1 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                            <p className="text-xs text-gray-500">
                              {formatDate(message.createdDate, locale)}
                            </p>
                            {isAdmin && (
                              <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>

                        {isAdmin && (
                          <Avatar className="h-8 w-8 ml-2 mt-1">
                            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Admin" />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              A
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Nhập nội dung..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="pr-12"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
