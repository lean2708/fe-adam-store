"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  MessageCircle, 
  Search, 
  Trash2, 
  Users, 
  Clock,
  User
} from "lucide-react";
import {
  fetchMyConversationsAction,
  fetchMessagesAction,
  searchMessagesAction,
  deleteMessageAction,
  searchConversationsByNameAction
} from "@/actions/chatActions";
import type { ConversationResponse, ChatMessageResponse } from "@/api-client/models";

export default function ChatAdminPage() {
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageSearchTerm, setMessageSearchTerm] = useState("");

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const result = await fetchMyConversationsAction();
      if (result.success && result.data) {
        setConversations(result.data);
      } else {
        toast.error(result.message || "Failed to load conversations");
      }
    } catch (error) {
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const result = await fetchMessagesAction(conversationId);
      if (result.success && result.data) {
        setMessages(result.data);
      } else {
        toast.error(result.message || "Failed to load messages");
      }
    } catch (error) {
      toast.error("Failed to load messages");
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

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const result = await deleteMessageAction(messageId);
      if (result.success) {
        toast.success("Message deleted successfully");
        // Reload messages
        if (selectedConversation?.id) {
          loadMessages(selectedConversation.id);
        }
      } else {
        toast.error(result.message || "Failed to delete message");
      }
    } catch (error) {
      toast.error("Failed to delete message");
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
    } catch (error) {
      toast.error("Failed to search conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchMessages = async () => {
    if (!selectedConversation?.id || !messageSearchTerm.trim()) {
      if (selectedConversation?.id) {
        loadMessages(selectedConversation.id);
      }
      return;
    }

    setMessagesLoading(true);
    try {
      const result = await searchMessagesAction(selectedConversation.id, messageSearchTerm);
      if (result.success && result.data) {
        setMessages(result.data);
      } else {
        toast.error(result.message || "Failed to search messages");
      }
    } catch (error) {
      toast.error("Failed to search messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat Management</h1>
        <p className="text-muted-foreground">
          Manage conversations and messages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Conversations
            </CardTitle>
            <CardDescription>
              Select a conversation to view messages
            </CardDescription>
            <div className="flex gap-2">
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchConversations()}
              />
              <Button onClick={handleSearchConversations} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No conversations found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{conversation.conversationName || "Unnamed Conversation"}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {conversation.id}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {conversation.participants?.length || 0} participants
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
              {selectedConversation && (
                <Badge variant="outline">
                  {selectedConversation.conversationName || "Unnamed"}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {selectedConversation 
                ? "Messages in selected conversation"
                : "Select a conversation to view messages"
              }
            </CardDescription>
            {selectedConversation && (
              <div className="flex gap-2">
                <Input
                  placeholder="Search messages..."
                  value={messageSearchTerm}
                  onChange={(e) => setMessageSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchMessages()}
                />
                <Button onClick={handleSearchMessages} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!selectedConversation ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to view messages</p>
              </div>
            ) : messagesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border ${
                      message.me ? "bg-primary/10 ml-8" : "bg-muted mr-8"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-sm">
                            {message.sender?.name || "Unknown User"}
                          </span>
                          {message.me && (
                            <Badge variant="secondary" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{message.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(message.createdDate)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => message.id && handleDeleteMessage(message.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
