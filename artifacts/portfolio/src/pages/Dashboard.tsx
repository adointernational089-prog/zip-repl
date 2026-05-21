import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useListApps, useGetMyMessages, useSendMessage, useGetMessage, useReplyToMessage, getGetMyMessagesQueryKey, getGetMessageQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutGrid, MessageSquare, ChevronRight, ExternalLink,
  ArrowLeft, Send, Loader2, User, Shield, Flame, Zap,
  TrendingUp, Clock, Star, Bell, Settings, LogOut, Home,
  Mail, Globe, Activity, Award, Sparkles
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"home" | "apps" | "messages" | "compose" | "thread">("home");
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [composeForm, setComposeForm] = useState({ name: "", email: "", message: "" });
  const [greeting, setGreeting] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#06060f" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse" style={{ background: "hsl(var(--primary) / 0.2)", border: "1px solid hsl(var(--primary) / 0.4)" }}>
            <img src="/scorpion-favicon.svg" alt="" className="w-8 h-8" />
          </div>
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "hsl(var(--primary))", animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
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

  const unreadMessages = myMessages.filter((m: any) => m.reply_count === 0).length;
  const totalReplies = myMessages.reduce((acc: number, m: any) => acc + (m.reply_count || 0), 0);

  const navItems: Array<{ id: "home" | "apps" | "messages"; label: string; icon: any; count?: number }> = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "apps", label: "Apps", icon: LayoutGrid, count: apps.length },
    { id: "messages", label: "Messages", icon: MessageSquare, count: myMessages.length },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#06060f", color: "#ffffff" }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.03] blur-3xl animate-pulse" style={{ background: "hsl(var(--primary))", top: "-10%", right: "-10%" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.025] blur-3xl" style={{ background: "#7c3aed", bottom: "10%", left: "-5%" }} />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── Top header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-dashboard-in">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))", border: "1px solid hsl(var(--primary) / 0.4)", boxShadow: "0 0 20px hsl(var(--primary) / 0.2)" }}>
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2" style={{ borderColor: "#06060f" }} />
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "hsl(var(--primary))" }}>{greeting},</p>
              <h1 className="text-2xl sm:text-3xl font-black">{user.name?.split(" ")[0] || "User"}</h1>
              <p className="text-xs" style={{ color: "#64748b" }}>{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link href="/admin">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))" }}>
                  <Shield className="w-3.5 h-3.5" />
                  Admin Panel
                </button>
              </Link>
            )}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {user.role === "admin" ? "Admin" : "Member"}
            </div>
          </div>
        </div>

        {/* ── Nav tabs ── */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 mb-8 animate-dashboard-in delay-100">
          <div className="flex gap-1 p-1 rounded-2xl w-fit min-w-full sm:min-w-0" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.07)" }}>
            {navItems.map(({ id, label, icon: Icon, count }) => {
              const isActive = activeTab === id || (id === "messages" && (activeTab === "compose" || activeTab === "thread"));
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-1 sm:flex-none justify-center sm:justify-start"
                  style={{
                    background: isActive ? "hsl(var(--primary) / 0.15)" : "transparent",
                    color: isActive ? "hsl(var(--primary))" : "#64748b",
                    border: isActive ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid transparent",
                    boxShadow: isActive ? `0 0 12px hsl(var(--primary) / 0.15)` : "none",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {count !== undefined && count > 0 && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: isActive ? "hsl(var(--primary) / 0.3)" : "rgba(255,255,255,0.08)", color: isActive ? "hsl(var(--primary))" : "#94a3b8" }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ HOME TAB ══ */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-dashboard-in delay-150">
              <StatCard icon={<LayoutGrid className="w-5 h-5" />} label="Apps Available" value={apps.length} color="cyan" delay={0} />
              <StatCard icon={<MessageSquare className="w-5 h-5" />} label="My Messages" value={myMessages.length} color="purple" delay={60} />
              <StatCard icon={<Bell className="w-5 h-5" />} label="Awaiting Reply" value={unreadMessages} color="orange" delay={120} />
              <StatCard icon={<Activity className="w-5 h-5" />} label="Replies Received" value={totalReplies} color="green" delay={180} />
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl p-5 animate-dashboard-in delay-200" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Browse Apps", icon: Globe, onClick: () => setActiveTab("apps"), color: "cyan" },
                  { label: "Send Message", icon: Mail, onClick: initComposeForm, color: "purple" },
                  { label: "View Inbox", icon: MessageSquare, onClick: () => setActiveTab("messages"), color: "orange" },
                  ...(isAdmin ? [{ label: "Admin Panel", icon: Settings, onClick: () => setLocation("/admin"), color: "green" }] : [{ label: "Portfolio", icon: Home, onClick: () => setLocation("/"), color: "green" }]),
                ].map(({ label, icon: Icon, onClick, color }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 group"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `hsl(var(--primary) / 0.3)`; (e.currentTarget as HTMLElement).style.background = `hsl(var(--primary) / 0.05)`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                      <Icon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight" style={{ color: "#94a3b8" }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent messages preview */}
            {myMessages.length > 0 && (
              <div className="rounded-2xl p-5 animate-dashboard-in delay-300" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                    Recent Messages
                  </h3>
                  <button onClick={() => setActiveTab("messages")} className="text-xs flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: "hsl(var(--primary))" }}>
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {myMessages.slice(0, 3).map((msg: any) => (
                    <button
                      key={msg.id}
                      onClick={() => { setSelectedMsgId(msg.id); setActiveTab("thread"); }}
                      className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01] group"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.25)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                        <MessageSquare className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">{msg.message}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "#64748b" }}>{new Date(msg.created_at).toLocaleDateString()}</p>
                      </div>
                      {msg.reply_count > 0 ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.25)" }}>{msg.reply_count} reply</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>Pending</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Welcome card if no activity */}
            {myMessages.length === 0 && (
              <div className="rounded-2xl p-8 text-center animate-dashboard-in delay-300 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, rgba(124,58,237,0.08) 100%)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.1) 0%, transparent 60%)" }} />
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center animate-float" style={{ background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.3)" }}>
                  <Sparkles className="w-7 h-7" style={{ color: "hsl(var(--primary))" }} />
                </div>
                <h3 className="font-black text-lg mb-2">Welcome to Bishal's Hub Portal</h3>
                <p className="text-sm mb-6" style={{ color: "#64748b" }}>Start by sending a message or exploring the available apps.</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={initComposeForm} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:scale-105" style={{ background: "hsl(var(--primary))" }}>
                    <Send className="w-4 h-4" />
                    Send a Message
                  </button>
                  <button onClick={() => setActiveTab("apps")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0" }}>
                    <Globe className="w-4 h-4" />
                    Browse Apps
                  </button>
                </div>
              </div>
            )}

            {/* Featured apps preview */}
            {apps.length > 0 && (
              <div className="rounded-2xl p-5 animate-dashboard-in delay-400" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Star className="w-4 h-4" style={{ color: "#fbbf24" }} />
                    Featured Apps
                  </h3>
                  <button onClick={() => setActiveTab("apps")} className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: "hsl(var(--primary))" }}>
                    All apps <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {apps.slice(0, 6).map((app: any) => (
                    <a key={app.id} href={app.url || "#"} target="_blank" rel="noreferrer"
                      className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 w-20"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.3)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                        {app.icon_url ? <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" /> : <Flame className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />}
                      </div>
                      <p className="text-[10px] font-medium text-center line-clamp-2 leading-tight" style={{ color: "#94a3b8" }}>{app.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ APPS TAB ══ */}
        {activeTab === "apps" && (
          <div className="animate-dashboard-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Available Apps</h2>
                <p className="text-xs mt-1" style={{ color: "#64748b" }}>{apps.length} apps unlocked for your account</p>
              </div>
            </div>
            {appsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>
            ) : apps.length === 0 ? (
              <EmptyState icon={LayoutGrid} title="No apps yet" desc="Apps added by Bishal will appear here." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {apps.map((app: any, i: number) => (
                  <a key={app.id} href={app.url || "#"} target="_blank" rel="noreferrer"
                    className="group"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div
                      className="rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all cursor-pointer h-full relative overflow-hidden"
                      style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px hsl(var(--primary) / 0.15)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)" }} />
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-primary/40 transition-colors">
                        {app.icon_url ? <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" /> : <Flame className="w-6 h-6" style={{ color: "hsl(var(--primary))" }} />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{app.name}</p>
                        {app.description && <p className="text-[11px] mt-1 line-clamp-2" style={{ color: "#64748b" }}>{app.description}</p>}
                      </div>
                      <div className="flex items-center gap-1 text-[10px]" style={{ color: "hsl(var(--primary) / 0.7)" }}>
                        <ExternalLink className="w-2.5 h-2.5" /> Open App
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ MESSAGES TAB ══ */}
        {activeTab === "messages" && (
          <div className="animate-dashboard-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">My Messages</h2>
                <p className="text-xs mt-1" style={{ color: "#64748b" }}>{myMessages.length} conversation{myMessages.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={initComposeForm} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105" style={{ background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))" }}>
                <Send className="w-3 h-3" /> New Message
              </button>
            </div>
            {msgsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>
            ) : myMessages.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No messages yet" desc="Send Bishal a message to start a conversation." action={{ label: "Send Message", onClick: initComposeForm }} />
            ) : (
              <div className="space-y-2">
                {myMessages.map((msg: any, i: number) => (
                  <button
                    key={msg.id}
                    onClick={() => { setSelectedMsgId(msg.id); setActiveTab("thread"); }}
                    className="w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.01] group"
                    style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.07)", animationDelay: `${i * 0.05}s` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.3)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                        <MessageSquare className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1 line-clamp-2 leading-snug">{msg.message}</p>
                        <p className="text-[11px]" style={{ color: "#64748b" }}>{new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {msg.reply_count > 0 ? (
                          <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.25)" }}>
                            {msg.reply_count} {msg.reply_count === 1 ? "reply" : "replies"}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>
                            Awaiting
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" style={{ color: "#64748b" }} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ COMPOSE TAB ══ */}
        {activeTab === "compose" && (
          <div className="max-w-xl animate-dashboard-in">
            <button onClick={() => setActiveTab("messages")} className="flex items-center gap-2 text-sm mb-5 transition-colors hover:opacity-80" style={{ color: "#64748b" }}>
              <ArrowLeft className="w-4 h-4" /> Back to messages
            </button>
            <h2 className="text-xl font-bold mb-5">Send a Message</h2>
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)" }} />
              <div className="space-y-4 relative z-10">
                <div>
                  <Label className="text-xs" style={{ color: "#94a3b8" }}>Name</Label>
                  <Input
                    value={composeForm.name}
                    onChange={(e) => setComposeForm({ ...composeForm, name: e.target.value })}
                    className="mt-1.5 text-sm"
                    style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: "#94a3b8" }}>Email</Label>
                  <Input
                    type="email"
                    value={composeForm.email}
                    onChange={(e) => setComposeForm({ ...composeForm, email: e.target.value })}
                    className="mt-1.5 text-sm"
                    style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: "#94a3b8" }}>Message</Label>
                  <Textarea
                    value={composeForm.message}
                    onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                    className="mt-1.5 resize-none text-sm"
                    style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    placeholder="Write your message..."
                    rows={5}
                  />
                </div>
                <button
                  onClick={() => sendMsgMutation.mutate({ data: { ...composeForm, user_id: user.id } })}
                  disabled={sendMsgMutation.isPending || !composeForm.name || !composeForm.email || !composeForm.message}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "hsl(var(--primary))", color: "#000", boxShadow: "0 4px 20px hsl(var(--primary) / 0.4)" }}
                >
                  {sendMsgMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sendMsgMutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ THREAD TAB ══ */}
        {activeTab === "thread" && thread && (
          <div className="max-w-2xl animate-dashboard-in">
            <button onClick={() => setActiveTab("messages")} className="flex items-center gap-2 text-sm mb-5 transition-colors hover:opacity-80" style={{ color: "#64748b" }}>
              <ArrowLeft className="w-4 h-4" /> Back to messages
            </button>
            <h2 className="text-xl font-bold mb-5">Conversation</h2>
            <div className="space-y-4 mb-5">
              {/* Original message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.3)" }}>
                  <User className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl rounded-tl-none p-4" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "hsl(var(--primary))" }}>{thread.name}</p>
                    <p className="text-sm break-words">{thread.message}</p>
                  </div>
                  <p className="text-[10px] mt-1 ml-1" style={{ color: "#475569" }}>{new Date(thread.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Replies */}
              {(thread as any).replies?.map((reply: any) => {
                const isFromAdmin = reply.sender_role === "admin";
                return (
                  <div key={reply.id} className={`flex gap-3 ${isFromAdmin ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`} style={{ background: isFromAdmin ? "hsl(var(--primary) / 0.15)" : "rgba(255,255,255,0.05)", border: isFromAdmin ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid rgba(255,255,255,0.08)" }}>
                      {isFromAdmin ? <Shield className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} /> : <User className="w-4 h-4" style={{ color: "#94a3b8" }} />}
                    </div>
                    <div className={`flex-1 min-w-0 flex flex-col ${isFromAdmin ? "items-end" : ""}`}>
                      <div className={`rounded-2xl p-4 max-w-[85%] ${isFromAdmin ? "rounded-tr-none" : "rounded-tl-none"}`} style={{ background: isFromAdmin ? "hsl(var(--primary) / 0.1)" : "#0d0d1f", border: isFromAdmin ? "1px solid hsl(var(--primary) / 0.25)" : "1px solid rgba(255,255,255,0.08)" }}>
                        <p className="text-[10px] font-semibold mb-1" style={{ color: isFromAdmin ? "hsl(var(--primary))" : "#94a3b8" }}>{isFromAdmin ? "Admin" : (reply.sender_name || "You")}</p>
                        <p className="text-sm break-words">{reply.content}</p>
                      </div>
                      <p className={`text-[10px] mt-1 ${isFromAdmin ? "mr-1" : "ml-1"}`} style={{ color: "#475569" }}>{new Date(reply.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply box */}
            <div className="rounded-2xl p-4 relative overflow-hidden" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }} />
              <div className="flex gap-3 relative z-10">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="flex-1 resize-none text-sm"
                  style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
                <button
                  onClick={() => replyMutation.mutate({ id: selectedMsgId || "", data: { content: replyContent } })}
                  disabled={replyMutation.isPending || !replyContent.trim()}
                  className="flex items-center justify-center w-10 h-10 rounded-xl self-end transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: "hsl(var(--primary))", color: "#000" }}
                >
                  {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, color, delay }: { icon: React.ReactNode; label: string; value: number; color: "cyan" | "purple" | "orange" | "green"; delay: number }) {
  const colors = {
    cyan:   { bg: "hsl(var(--primary) / 0.1)", border: "hsl(var(--primary) / 0.25)", text: "hsl(var(--primary))", glow: "hsl(var(--primary) / 0.2)" },
    purple: { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)", text: "#a78bfa", glow: "rgba(167,139,250,0.2)" },
    orange: { bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.25)", text: "#fb923c", glow: "rgba(251,146,60,0.2)" },
    green:  { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.25)", text: "#4ade80", glow: "rgba(74,222,128,0.2)" },
  }[color];
  return (
    <div
      className="rounded-2xl p-4 dashboard-stat-card relative overflow-hidden"
      style={{ background: "#0d0d1f", border: `1px solid ${colors.border}`, animationDelay: `${delay}ms`, boxShadow: `0 0 20px ${colors.glow}` }}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse at 0% 0%, ${colors.text}15 0%, transparent 60%)` }} />
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
          <span style={{ color: colors.text }}>{icon}</span>
        </div>
        <TrendingUp className="w-3.5 h-3.5 opacity-30" style={{ color: colors.text }} />
      </div>
      <p className="text-2xl font-black mb-1 relative z-10" style={{ color: colors.text }}>{value}</p>
      <p className="text-[11px] font-medium relative z-10" style={{ color: "#64748b" }}>{label}</p>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ icon: Icon, title, desc, action }: {
  icon: any; title: string; desc: string; action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
        <Icon className="w-7 h-7" style={{ color: "hsl(var(--primary) / 0.6)" }} />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-5 max-w-xs" style={{ color: "#64748b" }}>{desc}</p>
      {action && (
        <button onClick={action.onClick} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))" }}>
          {action.label}
        </button>
      )}
    </div>
  );
}
