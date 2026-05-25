import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LogOut, LayoutDashboard, Settings, User, Menu, X, Linkedin, Github, Sun, Moon } from "lucide-react";

const homeLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#skills", label: "Skills" },
  { href: "#latest-projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#why-me", label: "Why Me" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

function smoothScroll(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ThemeToggle({ className = "" }: { className?: string }) {
  const { activeTheme, setTheme } = useTheme();
  const isDark = activeTheme.mode === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "clean-white" : "neon-cyan")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative p-1.5 rounded-lg transition-all duration-300 overflow-hidden ${className}`}
      style={{
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <span
        className="flex items-center justify-center transition-transform duration-500"
        style={{ transform: isDark ? "rotate(0deg)" : "rotate(180deg)" }}
      >
        {isDark
          ? <Sun className="w-3.5 h-3.5 text-yellow-400" />
          : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
      </span>
    </button>
  );
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

        {/* Social icons — desktop */}
        <div className="hidden md:flex items-center gap-0.5 border-r pr-3 mr-1" style={{ borderColor: "hsl(var(--border) / 0.4)" }}>
          <a href="https://www.linkedin.com/in/bishal-bishwokarma-453608277" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-1.5 rounded-md text-muted-foreground hover:text-[#0a66c2] transition-colors hover:bg-[#0a66c2]/10">
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a href="https://github.com/bishalbishwokarma" target="_blank" rel="noreferrer" aria-label="GitHub" className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5">
            <Github className="w-3.5 h-3.5" />
          </a>
          <a href="https://www.facebook.com/bishal.bishwokarma.359" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-1.5 rounded-md text-muted-foreground hover:text-[#1877f2] transition-colors hover:bg-[#1877f2]/10">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
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
          <ThemeToggle />
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
