import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useListApps, useGetMyMessages, useSendMessage, useGetMessage, useReplyToMessage, getGetMyMessagesQueryKey, getGetMessageQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutGrid, MessageSquare, ChevronRight, ExternalLink,
  ArrowLeft, Send, Loader2, User, Shield, Flame
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"apps" | "messages" | "compose" | "thread">("apps");
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [composeForm, setComposeForm] = useState({ name: "", email: "", message: "" });
  const { toast } = useToast();

  const { data: apps = [], isLoading: appsLoading } = useListApps();
  const { data: myMessages = [], isLoading: msgsLoading, refetch: refetchMsgs } = useGetMyMessages({
    query: { queryKey: getGetMyMessagesQueryKey(), enabled: !!user }
  });
  const { data: thread, refetch: refetchThread } = useGetMessage(
    selectedMsgId || "",
    { query: { queryKey: getGetMessageQueryKey(selectedMsgId || ""), enabled: !!selectedMsgId } }
  );

  const sendMsgMutation = useSendMessage({
    mutation: {
      onSuccess: () => {
        toast({ title: "Message sent!", description: "Bishal will get back to you soon." });
        setComposeForm({ name: user?.name || "", email: user?.email || "", message: "" });
        refetchMsgs();
        setActiveTab("messages");
      },
      onError: () => toast({ title: "Error", description: "Failed to send message.", variant: "destructive" }),
    },
  });

  const replyMutation = useReplyToMessage({
    mutation: {
      onSuccess: () => {
        setReplyContent("");
        refetchThread();
        toast({ title: "Reply sent!" });
      },
      onError: () => toast({ title: "Error", description: "Failed to send reply.", variant: "destructive" }),
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const initComposeForm = () => {
    setComposeForm({ name: user.name || "", email: user.email || "", message: "" });
    setActiveTab("compose");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 max-w-5xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">
              Welcome back, <span className="text-primary">{user.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <Link href="/admin">
                <Button size="sm" className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-semibold text-xs h-8">
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-1.5" />
              {user.role === "admin" ? "Admin" : "Active"}
            </Badge>
          </div>
        </div>

        {/* Tabs — horizontally scrollable on mobile */}
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 mb-6 sm:mb-8">
          <div className="flex gap-1 p-1 bg-card rounded-xl border border-white/10 w-fit min-w-full sm:min-w-0">
            {([
              { id: "apps", label: "Apps", icon: LayoutGrid },
              { id: "messages", label: "Inbox", icon: MessageSquare },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 sm:flex-none justify-center sm:justify-start ${activeTab === id || (id === "messages" && (activeTab === "compose" || activeTab === "thread"))
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id === "messages" && myMessages.length > 0 && (
                  <Badge className="bg-primary/20 text-primary text-xs px-1.5 py-0 ml-1">{myMessages.length}</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Tab */}
        {activeTab === "apps" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-bold">Available Apps</h2>
              <span className="text-sm text-muted-foreground">{apps.length} apps</span>
            </div>
            {appsLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : apps.length === 0 ? (
              <EmptyState icon={LayoutGrid} title="No apps yet" desc="Apps added by Bishal will appear here." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {apps.map((app: any) => (
                  <a key={app.id} href={app.url || "#"} target="_blank" rel="noreferrer">
                    <Card className="bg-card border-white/10 hover:border-primary/50 transition-all group cursor-pointer h-full">
                      <CardContent className="p-3 sm:p-5 flex flex-col items-center text-center gap-2 sm:gap-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-primary/40 transition-colors">
                          {app.icon_url ? (
                            <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
                          ) : (
                            <Flame className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm group-hover:text-primary transition-colors leading-tight">{app.name}</p>
                          {app.description && <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">{app.description}</p>}
                        </div>
                        {app.url && (
                          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-bold">My Messages</h2>
              <Button size="sm" onClick={initComposeForm} className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 h-8 text-xs">
                <Send className="w-3 h-3 mr-1.5" />
                New
              </Button>
            </div>
            {msgsLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : myMessages.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No messages yet" desc="Send Bishal a message to start a conversation." action={{ label: "Send Message", onClick: initComposeForm }} />
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {myMessages.map((msg: any) => (
                  <Card
                    key={msg.id}
                    className="bg-card border-white/10 hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => { setSelectedMsgId(msg.id); setActiveTab("thread"); }}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm mb-1 line-clamp-2 leading-snug">{msg.message}</p>
                          <p className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {msg.reply_count > 0 ? (
                            <Badge className="bg-primary/10 text-primary text-[10px] sm:text-xs px-1.5">{msg.reply_count} {msg.reply_count === 1 ? "reply" : "replies"}</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] sm:text-xs bg-yellow-500/10 text-yellow-400 px-1.5">Awaiting</Badge>
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compose Tab */}
        {activeTab === "compose" && (
          <div className="max-w-xl">
            <button onClick={() => setActiveTab("messages")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to messages
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-5">Send a Message</h2>
            <Card className="bg-card border-white/10">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={composeForm.name}
                    onChange={(e) => setComposeForm({ ...composeForm, name: e.target.value })}
                    className="mt-1.5 bg-background border-white/10 focus:border-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    value={composeForm.email}
                    onChange={(e) => setComposeForm({ ...composeForm, email: e.target.value })}
                    className="mt-1.5 bg-background border-white/10 focus:border-primary"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label className="text-xs">Message</Label>
                  <Textarea
                    value={composeForm.message}
                    onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                    className="mt-1.5 bg-background border-white/10 focus:border-primary resize-none"
                    placeholder="Write your message..."
                    rows={5}
                  />
                </div>
                <Button
                  onClick={() => sendMsgMutation.mutate({ data: { ...composeForm, user_id: user.id } })}
                  disabled={sendMsgMutation.isPending || !composeForm.name || !composeForm.email || !composeForm.message}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                >
                  {sendMsgMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Thread Tab */}
        {activeTab === "thread" && thread && (
          <div className="max-w-2xl">
            <button onClick={() => setActiveTab("messages")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to messages
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-5">Conversation</h2>
            <div className="space-y-3 sm:space-y-4 mb-5">
              {/* Original message */}
              <div className="flex gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-card border border-white/10 rounded-xl rounded-tl-none p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-primary mb-1">{thread.name}</p>
                    <p className="text-xs sm:text-sm break-words">{thread.message}</p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 ml-1">{new Date(thread.created_at).toLocaleString()}</p>
                </div>
              </div>
              {/* Replies */}
              {(thread as any).replies?.map((reply: any) => {
                const isFromAdmin = reply.sender_role === "admin";
                return (
                  <div key={reply.id} className={`flex gap-2 sm:gap-3 ${isFromAdmin ? "flex-row-reverse" : ""}`}>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isFromAdmin ? "bg-primary/20 border border-primary/30" : "bg-white/5 border border-white/10"}`}>
                      {isFromAdmin ? <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /> : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </div>
                    <div className={`flex-1 min-w-0 ${isFromAdmin ? "items-end" : ""} flex flex-col`}>
                      <div className={`border rounded-xl p-3 sm:p-4 max-w-[85%] sm:max-w-xs md:max-w-sm ${isFromAdmin ? "bg-primary/10 border-primary/30 rounded-tr-none ml-auto" : "bg-card border-white/10 rounded-tl-none"}`}>
                        <p className={`text-[10px] sm:text-xs font-semibold mb-1 ${isFromAdmin ? "text-primary" : "text-muted-foreground"}`}>{reply.sender_name}</p>
                        <p className="text-xs sm:text-sm break-words">{reply.content}</p>
                      </div>
                      <p className={`text-[10px] sm:text-xs text-muted-foreground mt-1 ${isFromAdmin ? "text-right mr-1" : "ml-1"}`}>{new Date(reply.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Card className="bg-card border-white/10">
              <CardContent className="p-3 sm:p-4 flex gap-2 sm:gap-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="bg-background border-white/10 focus:border-primary resize-none flex-1 text-sm"
                />
                <Button
                  onClick={() => replyMutation.mutate({ id: selectedMsgId || "", data: { content: replyContent } })}
                  disabled={replyMutation.isPending || !replyContent.trim()}
                  className="bg-primary hover:bg-primary/90 text-black font-bold self-end h-9 w-9 p-0"
                >
                  {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action }: {
  icon: any; title: string; desc: string; action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
      <div className="p-4 bg-white/5 rounded-full mb-4">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-2 text-sm sm:text-base">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-xs">{desc}</p>
      {action && (
        <Button size="sm" onClick={action.onClick} className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">
          {action.label}
        </Button>
      )}
    </div>
  );
}
