import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

export default function AdminSettings() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      setLocation("/dashboard");
    }
  }, [isLoading, user, isAdmin, setLocation]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "New password and confirm password must be the same.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsPending(true);
    try {
      const token = localStorage.getItem("bishals_hub_token");
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Failed to change password", description: data.error || "Something went wrong.", variant: "destructive" });
      } else {
        toast({ title: "Password changed!", description: "Your password has been updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast({ title: "Error", description: "Could not connect to server.", variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your admin account preferences.</p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Account info */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Account Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Change password */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription className="text-xs">Update your admin account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="bg-background/50 border-white/10 focus-visible:ring-primary/50 pr-10"
                  />
                  <EyeToggle show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="bg-background/50 border-white/10 focus-visible:ring-primary/50 pr-10"
                  />
                  <EyeToggle show={showNew} onToggle={() => setShowNew(!showNew)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter new password"
                    className="bg-background/50 border-white/10 focus-visible:ring-primary/50 pr-10"
                  />
                  <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(0,191,255,0.25)]"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
