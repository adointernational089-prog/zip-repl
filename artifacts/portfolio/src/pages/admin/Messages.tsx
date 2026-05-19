import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useListMessages, useGetMessage, useReplyToMessage } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Send, MessageSquare, User, Shield } from "lucide-react";

export default function AdminMessages() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { data: messages = [], isLoading: msgsLoading, refetch: refetchList } = useListMessages({
    query: { enabled: !!isAdmin }
  });

  const { data: thread, isLoading: threadLoading, refetch: refetchThread } = useGetMessage(
    selectedId || "",
    { query: { enabled: !!selectedId } }
  );

  const replyMutation = useReplyToMessage(selectedId || "", {
    mutation: {
      onSuccess: () => {
        setReplyContent("");
        refetchThread();
        refetchList();
        toast({ title: "Reply sent!" });
      },
      onError: () => toast({ title: "Error", description: "Failed to send reply.", variant: "destructive" }),
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!user || !isAdmin) { setLocation("/dashboard"); return null; }

  if (selectedId && thread) {
    return (
      <AdminLayout>
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to messages
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">{thread.name}</h1>
            <p className="text-sm text-muted-foreground">{thread.email}</p>
          </div>
          <span className="text-xs text-muted-foreground">{new Date(thread.created_at).toLocaleString()}</span>
        </div>

        <div className="space-y-4 mb-6 max-w-2xl">
          {/* Original message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="bg-card border border-white/10 rounded-xl rounded-tl-none p-4">
                <p className="text-sm font-medium mb-1">{thread.name}</p>
                <p className="text-sm">{thread.message}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-1">{new Date(thread.created_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Replies */}
          {(thread as any).replies?.map((reply: any) => {
            const isFromAdmin = reply.sender_role === "admin";
            return (
              <div key={reply.id} className={`flex gap-3 ${isFromAdmin ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${isFromAdmin ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/10"}`}>
                  {isFromAdmin ? <Shield className="w-4 h-4 text-primary" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`flex-1 flex flex-col ${isFromAdmin ? "items-end" : ""}`}>
                  <div className={`border rounded-xl p-4 w-fit max-w-sm ${isFromAdmin ? "bg-primary/10 border-primary/30 rounded-tr-none ml-auto" : "bg-card border-white/10 rounded-tl-none"}`}>
                    <p className={`text-xs font-semibold mb-1 ${isFromAdmin ? "text-primary" : "text-muted-foreground"}`}>{reply.sender_name}</p>
                    <p className="text-sm">{reply.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${isFromAdmin ? "mr-1 text-right" : "ml-1"}`}>{new Date(reply.created_at).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <Card className="bg-card border-white/10 max-w-2xl">
          <CardContent className="p-4 flex gap-3">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply to the user..."
              rows={3}
              className="bg-background border-white/10 focus:border-primary resize-none flex-1"
            />
            <Button
              onClick={() => replyMutation.mutate({ data: { content: replyContent } })}
              disabled={replyMutation.isPending || !replyContent.trim()}
              className="bg-primary hover:bg-primary/90 text-black font-bold self-end"
            >
              {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Messages</h1>
          <p className="text-muted-foreground text-sm">All incoming messages from users and visitors.</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
          {messages.length} total
        </Badge>
      </div>

      {msgsLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No messages yet</h3>
          <p className="text-sm text-muted-foreground">Messages from users will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <Card
              key={msg.id}
              className="bg-card border-white/10 hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setSelectedId(msg.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">{msg.email}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {msg.reply_count > 0 ? (
                      <Badge className="bg-green-500/10 text-green-400 text-xs">{msg.reply_count} {msg.reply_count === 1 ? "reply" : "replies"}</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-400 text-xs">Needs reply</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
