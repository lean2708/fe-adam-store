"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  fetchMyConversationsAction,
  fetchMessagesAction,
  searchConversationsByNameAction
} from "@/actions/chatActions";
import type { ConversationResponse, ChatMessageResponse } from "@/api-client/models";
import { formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function ChatTestPage() {
  const locale = useLocale();
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const testFetchConversations = async () => {
    setLoading(true);
    try {
      console.log("🔄 Fetching conversations from mock data...");
      const result = await fetchMyConversationsAction();
      
      if (result.success && result.data) {
        setConversations(result.data);
        console.log("✅ Successfully fetched conversations:", result.data);
        toast.success(`Fetched ${result.data.length} conversations from mock data!`);
      } else {
        console.error("❌ Failed to fetch conversations:", result.message);
        toast.error(result.message || "Failed to fetch conversations");
      }
    } catch (error) {
      console.error("❌ Error fetching conversations:", error);
      toast.error("Error fetching conversations");
    } finally {
      setLoading(false);
    }
  };

  const testFetchMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      console.log(`🔄 Fetching messages for conversation ${conversationId}...`);
      const result = await fetchMessagesAction(conversationId);
      
      if (result.success && result.data) {
        setMessages(result.data);
        console.log("✅ Successfully fetched messages:", result.data);
        toast.success(`Fetched ${result.data.length} messages from mock data!`);
      } else {
        console.error("❌ Failed to fetch messages:", result.message);
        toast.error(result.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      toast.error("Error fetching messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const testSearchConversations = async () => {
    setLoading(true);
    try {
      console.log("🔄 Searching conversations for 'Người dùng'...");
      const result = await searchConversationsByNameAction("Người dùng");
      
      if (result.success && result.data) {
        setConversations(result.data);
        console.log("✅ Successfully searched conversations:", result.data);
        toast.success(`Found ${result.data.length} conversations matching search!`);
      } else {
        console.error("❌ Failed to search conversations:", result.message);
        toast.error(result.message || "Failed to search conversations");
      }
    } catch (error) {
      console.error("❌ Error searching conversations:", error);
      toast.error("Error searching conversations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat Mock Data Test</h1>
        <p className="text-muted-foreground">
          Test the mock data fetching functionality for chat system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Mock Data Tests</CardTitle>
            <CardDescription>
              Click the buttons below to test mock data fetching
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testFetchConversations} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Fetch All Conversations"}
            </Button>
            
            <Button 
              onClick={testSearchConversations} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? "Searching..." : "Search 'Người dùng'"}
            </Button>

            {conversations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Test Message Fetching:</p>
                {conversations.slice(0, 3).map((conv) => (
                  <Button
                    key={conv.id}
                    onClick={() => conv.id && testFetchMessages(conv.id)}
                    disabled={messagesLoading}
                    variant="secondary"
                    size="sm"
                    className="w-full text-left justify-start"
                  >
                    {messagesLoading ? "Loading..." : `Get messages: ${conv.participants?.[1]?.name || 'Unknown'}`}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Mock data fetching results will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : conversations.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Conversations ({conversations.length})</h3>
                  <Badge variant="secondary">Mock Data</Badge>
                </div>
                {conversations.map((conv) => (
                  <div key={conv.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {conv.participants?.[1]?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {conv.id} | Participants: {conv.participants?.length || 0}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {conv.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No data loaded yet. Click a test button above.
              </p>
            )}

            {messages.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Messages ({messages.length})</h3>
                  <Badge variant="secondary">Mock Data</Badge>
                </div>
                {messages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg border ${
                    msg.me ? "bg-primary/10 ml-8" : "bg-muted mr-8"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {msg.sender?.name || "Unknown"}
                          </span>
                          {msg.me && (
                            <Badge variant="secondary" className="text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{msg.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(msg.createdDate, locale)}
                        </p>
                      </div>
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
