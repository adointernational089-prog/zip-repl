import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, LayoutDashboard, Settings, User, Menu, X } from "lucide-react";

const homeLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#latest-projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

function smoothScroll(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = location === "/";

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b" style={{ background: "hsl(var(--background) / 0.95)", borderColor: "hsl(var(--border) / 0.4)" }}>
      {/* ── Main bar ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 relative"
            style={{
              background: "linear-gradient(135deg, #060d1a, #0a1628)",
              border: "1px solid rgba(0,212,255,0.3)",
              boxShadow: "0 0 8px rgba(0,212,255,0.4)",
            }}
          >
            <img src="/scorpion-favicon.svg" alt="Scorpion" className="w-full h-full object-contain p-0.5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm text-foreground tracking-tight">Bishal's Hub</span>
            <span className="text-[9px] text-muted-foreground tracking-[0.18em] uppercase font-medium hidden sm:block">PORTAL</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        {isHome && (
          <div className="hidden md:flex items-center gap-1 text-sm">
            {homeLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); smoothScroll(link.href); }}
                className="px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs rounded-full hover:bg-muted cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Settings className="w-3.5 h-3.5" />Admin
                  </button>
                </Link>
              )}
              <Link href="/dashboard">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <LayoutDashboard className="w-3.5 h-3.5" />Dashboard
                </button>
              </Link>
              <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground leading-tight max-w-[120px] text-right">
                connect with admin<br />for queries
              </span>
              <Link href="/login">
                <button
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}
                >
                  <User className="w-3 h-3" />
                  Sign In / Sign Up →
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: sign-in + burger */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <Link href="/login">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}
              >
                <User className="w-3 h-3" />Sign In
              </button>
            </Link>
          )}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile nav link strip ── */}
      {isHome && (
        <div
          className="md:hidden border-b overflow-x-auto"
          style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border) / 0.2)" }}
        >
          <div className="flex px-3 py-1.5 gap-0.5 w-max min-w-full justify-between">
            {homeLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); smoothScroll(link.href); }}
                className="flex-1 text-center px-2 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile user menu dropdown ── */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-b px-4 pb-4 pt-2 space-y-1" style={{ background: "hsl(var(--background) / 0.98)", borderColor: "hsl(var(--border) / 0.5)" }}>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              Dashboard
            </div>
          </Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors">
                <Settings className="w-4 h-4 text-primary" />
                Admin Panel
              </div>
            </Link>
          )}
          <button
            onClick={() => { setMobileMenuOpen(false); logout(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
