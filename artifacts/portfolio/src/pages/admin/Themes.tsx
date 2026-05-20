import { useState } from "react";
import { Palette, Check, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AdminThemes() {
  const { activeTheme, themes, setTheme } = useTheme();
  const { toast } = useToast();
  const [applying, setApplying] = useState<string | null>(null);

  async function handleSelect(id: string) {
    if (id === activeTheme.id || applying) return;
    setApplying(id);
    try {
      await setTheme(id);
      toast({ title: "Theme applied", description: `Website theme changed to "${themes.find(t => t.id === id)?.name}".` });
    } catch {
      toast({ title: "Error", description: "Failed to save theme. Please try again.", variant: "destructive" });
    } finally {
      setApplying(null);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Palette className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Website Themes</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Choose a theme to instantly change the colour palette across your entire website. Changes apply immediately for all visitors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {themes.map((theme) => {
            const isActive = theme.id === activeTheme.id;
            const isApplying = applying === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelect(theme.id)}
                disabled={!!applying}
                className={cn(
                  "relative rounded-xl border-2 overflow-hidden text-left transition-all duration-200 focus:outline-none group",
                  isActive
                    ? "border-primary shadow-[0_0_20px_rgba(var(--primary-rgb,0,191,255),0.3)]"
                    : "border-border hover:border-primary/50 hover:shadow-[0_0_12px_rgba(var(--primary-rgb,0,191,255),0.15)]",
                  applying && !isApplying ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {/* Colour preview strip */}
                <div
                  className="h-24 w-full relative flex items-center justify-center"
                  style={{ background: theme.bgHex }}
                >
                  {/* Orbs */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `radial-gradient(ellipse at 30% 50%, ${theme.primaryHex}55 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, ${theme.primaryHex}33 0%, transparent 60%)`,
                    }}
                  />
                  {/* Sample UI dots */}
                  <div className="flex items-center gap-2 z-10">
                    {[1, 0.6, 0.35].map((opacity, i) => (
                      <div
                        key={i}
                        className="rounded-full"
                        style={{
                          width: i === 0 ? 28 : i === 1 ? 20 : 14,
                          height: i === 0 ? 28 : i === 1 ? 20 : 14,
                          background: theme.primaryHex,
                          opacity,
                          boxShadow: i === 0 ? `0 0 14px ${theme.primaryHex}99` : "none",
                        }}
                      />
                    ))}
                  </div>
                  {/* Text sample */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                    <div className="h-1.5 rounded-full flex-1" style={{ background: theme.primaryHex, opacity: 0.9 }} />
                    <div className="h-1.5 rounded-full w-1/2" style={{ background: "#ffffff", opacity: 0.2 }} />
                  </div>

                  {/* Active badge */}
                  {isActive && (
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: theme.primaryHex, color: "#000" }}
                    >
                      <Check className="w-2.5 h-2.5" />
                      Active
                    </div>
                  )}

                  {/* Applying spinner */}
                  {isApplying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{theme.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{theme.description}</p>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border border-white/20"
                      style={{ background: theme.primaryHex }}
                    />
                  </div>
                  {isActive ? (
                    <div className="mt-3 text-xs font-medium" style={{ color: theme.primaryHex }}>
                      ✓ Currently active
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      Click to apply →
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-border bg-card/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">How it works: </span>
          Theme changes apply instantly for all visitors. The selected theme is saved to the database and loaded automatically on every page visit.
        </div>
      </div>
    </AdminLayout>
  );
}
