import { Link, useLocation } from "wouter";
import { LayoutDashboard, MessageSquare, LayoutGrid, Users, LogOut, ArrowLeft, FolderOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/apps", label: "Apps", icon: LayoutGrid },
  { href: "/admin/projects", label: "Latest Projects", icon: FolderOpen },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-card/30 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-bold text-xl text-primary neon-text">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-primary/20 text-primary border border-primary/30 shadow-[inset_0_0_10px_rgba(0,191,255,0.1)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full justify-start border-white/10 bg-transparent hover:bg-white/5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>
          <Button variant="ghost" onClick={logout} className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
