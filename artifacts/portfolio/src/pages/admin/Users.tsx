import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useListUsers, getListUsersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Loader2, Users, Shield, User, Calendar } from "lucide-react";

export default function AdminUsers() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: users = [], isLoading: usersLoading } = useListUsers({
    query: { queryKey: getListUsersQueryKey(), enabled: !!isAdmin }
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!user || !isAdmin) { setLocation("/dashboard"); return null; }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Users</h1>
          <p className="text-muted-foreground text-sm">All registered users on the platform.</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
          {users.length} users
        </Badge>
      </div>

      {usersLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No users yet</h3>
          <p className="text-sm text-muted-foreground">Users will appear here when they register.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u: any) => (
            <Card key={u.id} className="bg-card border-white/10 hover:border-white/20 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${u.role === "admin" ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/10"}`}>
                    {u.role === "admin" ? <Shield className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{u.name}</span>
                      <Badge className={`text-xs ${u.role === "admin" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"}`}>
                        {u.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined {new Date(u.created_at).toLocaleDateString()}
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
