import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Megaphone, Trash2, Send, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const TYPE_OPTIONS = [
  { value: "info",    label: "Info",    color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.25)",  icon: Info },
  { value: "success", label: "Success", color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)",  icon: CheckCircle2 },
  { value: "warning", label: "Warning", color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)",  icon: AlertTriangle },
  { value: "alert",   label: "Alert",   color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", icon: AlertCircle },
];

function getTypeStyle(type: string) {
  return TYPE_OPTIONS.find(t => t.value === type) ?? TYPE_OPTIONS[0];
}

async function authFetch(url: string, opts?: RequestInit) {
  const token = localStorage.getItem("bishals_hub_token");
  return fetch(url, {
    ...opts,
    headers: {
      ...(opts?.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export default function AdminBroadcast() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState({ title: "", content: "", type: "info" });

  const { data: broadcasts = [], isLoading: bLoading } = useQuery<any[]>({
    queryKey: ["admin-broadcasts"],
    queryFn: async () => {
      const r = await authFetch(`${BASE}/api/admin/broadcasts`);
      if (!r.ok) return [];
      return r.json();
    },
    enabled: !!isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const r = await authFetch(`${BASE}/api/admin/broadcasts`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error((e as any).error || "Failed");
      }
      return r.json();
    },
    onSuccess: () => {
      toast({ title: "Announcement sent!", description: "All users will see it in their dashboard." });
      setForm({ title: "", content: "", type: "info" });
      qc.invalidateQueries({ queryKey: ["admin-broadcasts"] });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const r = await authFetch(`${BASE}/api/admin/broadcasts/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      toast({ title: "Announcement deleted" });
      qc.invalidateQueries({ queryKey: ["admin-broadcasts"] });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete.", variant: "destructive" }),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!user || !isAdmin) { setLocation("/dashboard"); return null; }

  const selectedType = getTypeStyle(form.type);

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.3)" }}>
          <Megaphone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Broadcast</h1>
          <p className="text-sm text-muted-foreground">Send an announcement to all users.</p>
        </div>
      </div>

      {/* Compose form */}
      <Card className="bg-card border-white/10 mb-8">
        <CardContent className="p-6 space-y-5">
          <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">New Announcement</h2>

          {/* Type selector */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Type</p>
            <div className="flex gap-2 flex-wrap">
              {TYPE_OPTIONS.map(t => {
                const Icon = t.icon;
                const active = form.type === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setForm(f => ({ ...f, type: t.value }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: active ? t.bg : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? t.border : "rgba(255,255,255,0.1)"}`,
                      color: active ? t.color : "#64748b",
                      transform: active ? "scale(1.04)" : "scale(1)",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />{t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Title</p>
            <Input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. New feature launched!"
              className="bg-background border-white/10 focus:border-primary"
            />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Message</p>
            <Textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Write the announcement message for your users..."
              rows={4}
              className="bg-background border-white/10 focus:border-primary resize-none"
            />
          </div>

          {/* Preview */}
          {(form.title || form.content) && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Preview</p>
              <div className="rounded-xl p-4 flex gap-3" style={{ background: selectedType.bg, border: `1px solid ${selectedType.border}` }}>
                <selectedType.icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: selectedType.color }} />
                <div>
                  {form.title && <p className="font-semibold text-sm" style={{ color: selectedType.color }}>{form.title}</p>}
                  {form.content && <p className="text-sm mt-0.5 text-muted-foreground">{form.content}</p>}
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={() => createMutation.mutate(form)}
            disabled={createMutation.isPending || !form.title.trim() || !form.content.trim()}
            className="bg-primary hover:bg-primary/90 text-black font-bold"
          >
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Send to All Users
          </Button>
        </CardContent>
      </Card>

      {/* Past broadcasts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Active Announcements</h2>
          <Badge className="bg-primary/10 text-primary border-primary/20">{broadcasts.length}</Badge>
        </div>

        {bLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : broadcasts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center text-muted-foreground">
            <Megaphone className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No announcements yet. Send one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {broadcasts.map((b: any) => {
              const ts = getTypeStyle(b.type);
              const Icon = ts.icon;
              return (
                <Card key={b.id} className="bg-card border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: ts.bg, border: `1px solid ${ts.border}` }}>
                          <Icon className="w-4 h-4" style={{ color: ts.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-sm">{b.title}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{b.type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{b.content}</p>
                          <p className="text-[10px] text-muted-foreground/50 mt-1">{new Date(b.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(b.id)}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive flex-shrink-0 h-8 w-8"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
