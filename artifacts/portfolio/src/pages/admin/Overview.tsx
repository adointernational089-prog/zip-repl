import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useGetAdminStats, useListMessages } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { MessageSquare, Users, LayoutGrid, Inbox, Loader2, TrendingUp, Bell } from "lucide-react";

export default function AdminOverview() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useGetAdminStats({
    query: { enabled: !!isAdmin }
  });

  const { data: messages = [], isLoading: msgsLoading } = useListMessages({
    query: { enabled: !!isAdmin }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    setLocation("/dashboard");
    return null;
  }

  const statCards = [
    { label: "Total Messages", value: stats?.total_messages ?? "—", icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total Users", value: stats?.total_users ?? "—", icon: Users, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Apps", value: stats?.total_apps ?? "—", icon: LayoutGrid, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Unread Messages", value: stats?.unread_messages ?? "—", icon: Inbox, color: "text-primary", bg: "bg-primary/10" },
  ];

  const recentMessages = messages.slice(0, 5);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Admin Overview</h1>
        <p className="text-muted-foreground text-sm">Welcome back, Bishal. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {statsLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Messages */}
      <Card className="bg-card border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {msgsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : recentMessages.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg: any) => (
                <div key={msg.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">{msg.email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {msg.reply_count > 0 ? (
                      <Badge className="bg-green-500/10 text-green-400 text-xs">{msg.reply_count} replies</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-400 text-xs">Unread</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
