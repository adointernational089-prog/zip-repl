import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, MessageSquare, LayoutGrid, Users, LogOut, ArrowLeft, FolderOpen, Menu, X, FileText, Palette, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/apps", label: "Apps", icon: LayoutGrid },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/themes", label: "Themes", icon: Palette },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-card/40 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-primary text-sm">Admin Panel</span>
        </div>
        <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">{user?.email}</span>
      </div>

      {/* Mobile nav drawer overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-64 z-40 bg-[#0a0a1a] border-r border-white/10 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-primary">Admin Panel</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[160px]">{user?.email}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isActive ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
            <Button variant="outline" size="sm" className="w-full justify-start border-white/10 bg-transparent hover:bg-white/5 text-muted-foreground text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />Back to Hub
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => { setSidebarOpen(false); logout(); }} className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive text-xs">
            <LogOut className="w-3.5 h-3.5 mr-2" />Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 border-r border-white/10 bg-card/30 flex-col flex-shrink-0 sticky top-0 h-screen">
          <div className="p-6 border-b border-white/10">
            <h2 className="font-bold text-xl text-primary">Admin Panel</h2>
            <p className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isActive ? "bg-primary/20 text-primary border border-primary/30 shadow-[inset_0_0_10px_rgba(0,191,255,0.1)]" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
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
                <ArrowLeft className="w-4 h-4 mr-2" />Back to Hub
              </Button>
            </Link>
            <Button variant="ghost" onClick={logout} className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />Sign Out
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
