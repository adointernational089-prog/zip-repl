import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, LayoutDashboard, Settings, User } from "lucide-react";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#06060f]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" style={{background: "linear-gradient(135deg, #ff6b6b, #ffa347, #ff6bcb, #6b6bff)"}}>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-sm font-black">B</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm text-white tracking-tight">Bishal's Hub</span>
            <span className="text-[9px] text-slate-400 tracking-[0.18em] uppercase font-medium">SAAS PORTAL</span>
          </div>
        </Link>

        {isHome && (
          <div className="hidden md:flex items-center gap-1 text-sm">
            <a href="#hero" className="px-3 py-1.5 rounded-full border border-white/20 text-white font-medium text-xs">Home</a>
            <a href="#about" className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors text-xs">About</a>
            <a href="#skills" className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors text-xs">Skills</a>
            <a href="#projects" className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors text-xs">Projects</a>
            <a href="#services" className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors text-xs">Services</a>
            <a href="#contact" className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors text-xs">Contact</a>
          </div>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                    <Settings className="w-3.5 h-3.5" />Admin
                  </button>
                </Link>
              )}
              <Link href="/dashboard">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                  <LayoutDashboard className="w-3.5 h-3.5" />Dashboard
                </button>
              </Link>
              <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-[10px] text-slate-500 leading-tight max-w-[120px] text-right">
                connect with admin<br />for queries
              </span>
              <Link href="/login">
                <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all" style={{background: "linear-gradient(90deg, #0ea5e9, #2563eb)"}}>
                  <User className="w-3 h-3" />
                  Sign In / Sign Up →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
