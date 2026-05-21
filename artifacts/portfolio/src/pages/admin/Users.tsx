import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  useListUsers, getListUsersQueryKey,
  useAdminCreateUser, useAdminDeleteUser,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  Loader2, Users, Shield, User, Calendar,
  Trash2, UserPlus, X, Eye, EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function InputField({
  label, type = "text", value, onChange, placeholder, required, children
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; children?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 tracking-wider uppercase" style={{ color: "#94a3b8" }}>
        {label}{required && <span style={{ color: "hsl(var(--primary))" }}> *</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
          style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          onFocus={(e) => (e.target.style.borderColor = "hsl(var(--primary) / 0.6)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
        {children}
      </div>
    </div>
  );
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" as "user" | "admin" });
  const [showPass, setShowPass] = useState(false);

  const createMutation = useAdminCreateUser({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast({ title: "User created", description: `${form.name} has been added to the platform.` });
        onClose();
      },
      onError: (err: any) => {
        const msg = err?.message || "Failed to create user";
        toast({ title: "Error", description: msg, variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    createMutation.mutate({ data: form });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 0 60px hsl(var(--primary) / 0.12)" }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.7), transparent)" }} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black text-lg text-white">Add New User</h2>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Create a new account on the platform</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "#64748b" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="John Doe" required />
          <InputField label="Email Address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="john@example.com" required />

          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wider uppercase" style={{ color: "#94a3b8" }}>
              Password <span style={{ color: "hsl(var(--primary))" }}>*</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                required
                className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm outline-none transition-all"
                style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                onFocus={(e) => (e.target.style.borderColor = "hsl(var(--primary) / 0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#64748b" }}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wider uppercase" style={{ color: "#94a3b8" }}>Role</label>
            <div className="flex gap-2">
              {(["user", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize"
                  style={{
                    background: form.role === r ? "hsl(var(--primary) / 0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.role === r ? "hsl(var(--primary) / 0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: form.role === r ? "hsl(var(--primary))" : "#64748b",
                  }}
                >
                  {r === "admin" ? "👑 Admin" : "👤 User"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] disabled:opacity-60 mt-2"
            style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #2563eb)", boxShadow: "0 4px 20px hsl(var(--primary) / 0.25)" }}
          >
            {createMutation.isPending ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span>
            ) : (
              <span className="flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" /> Create User</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: users = [], isLoading: usersLoading } = useListUsers({
    query: { queryKey: getListUsersQueryKey(), enabled: !!isAdmin },
  });

  const deleteMutation = useAdminDeleteUser({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast({ title: "User deleted", description: "The user has been removed from the platform." });
        setConfirmDelete(null);
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err?.message || "Failed to delete user", variant: "destructive" });
        setConfirmDelete(null);
      },
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!user || !isAdmin) { setLocation("/dashboard"); return null; }

  const adminCount = (users as any[]).filter((u) => u.role === "admin").length;
  const userCount = (users as any[]).filter((u) => u.role === "user").length;

  return (
    <>
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} />}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "#0d0d1f", border: "1px solid rgba(239,68,68,0.25)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-black text-center text-white mb-2">Delete User?</h3>
            <p className="text-sm text-center mb-6" style={{ color: "#94a3b8" }}>
              This action cannot be undone. The user will permanently lose access.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: confirmDelete })}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{ background: "linear-gradient(90deg, #dc2626, #b91c1c)" }}
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminLayout>
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black mb-1">Users</h1>
            <p className="text-muted-foreground text-sm">Manage all registered users on the platform.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                {(users as any[]).length} total
              </Badge>
              <Badge className="bg-white/5 text-muted-foreground border-white/10 px-3 py-1">
                {adminCount} admin{adminCount !== 1 ? "s" : ""}
              </Badge>
              <Badge className="bg-white/5 text-muted-foreground border-white/10 px-3 py-1">
                {userCount} user{userCount !== 1 ? "s" : ""}
              </Badge>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #2563eb)", boxShadow: "0 4px 16px hsl(var(--primary) / 0.25)" }}
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {usersLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (users as any[]).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No users yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Users will appear here when they register.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #2563eb)" }}
            >
              <UserPlus className="w-4 h-4" /> Add First User
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {(users as any[]).map((u: any) => {
              const isSelf = u.id === user?.id;
              const isPrimaryAdmin = u.email === "bishalbishwokarma089@gmail.com";
              const canDelete = !isSelf && !isPrimaryAdmin;

              return (
                <Card
                  key={u.id}
                  className="border-white/10 hover:border-white/20 transition-all"
                  style={{ background: "#0d0d1f" }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${u.role === "admin" ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/10"}`}
                      >
                        {u.role === "admin" ? <Shield className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-muted-foreground" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{u.name}</span>
                          {isSelf && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#86efac" }}>
                              You
                            </span>
                          )}
                          <Badge
                            className={`text-xs ${u.role === "admin" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"}`}
                          >
                            {u.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                      </div>

                      {/* Joined date */}
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(u.created_at).toLocaleDateString()}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => canDelete && setConfirmDelete(u.id)}
                        disabled={!canDelete}
                        title={
                          isSelf ? "Cannot delete your own account"
                          : isPrimaryAdmin ? "Cannot delete the primary admin"
                          : "Delete user"
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
                        style={{
                          color: canDelete ? "#ef4444" : "#374151",
                          background: canDelete ? "rgba(239,68,68,0.08)" : "transparent",
                          border: canDelete ? "1px solid rgba(239,68,68,0.2)" : "1px solid transparent",
                          cursor: canDelete ? "pointer" : "not-allowed",
                          opacity: canDelete ? 1 : 0.3,
                        }}
                        onMouseEnter={(e) => { if (canDelete) (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }}
                        onMouseLeave={(e) => { if (canDelete) (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
