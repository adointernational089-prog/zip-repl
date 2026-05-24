import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const EMOJIS: { emoji: string; label: string }[] = [
  { emoji: "👏", label: "Clap" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "😍", label: "Love" },
  { emoji: "💯", label: "Perfect" },
  { emoji: "⚡", label: "Wow" },
];

function getLocalKey(targetType: string, targetId: string) {
  return `reactions_${targetType}_${targetId}`;
}

function getLocalReacted(targetType: string, targetId: string): Set<string> {
  try {
    const raw = localStorage.getItem(getLocalKey(targetType, targetId));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function setLocalReacted(targetType: string, targetId: string, reacted: Set<string>) {
  try {
    localStorage.setItem(getLocalKey(targetType, targetId), JSON.stringify([...reacted]));
  } catch {}
}

interface ReactionBarProps {
  targetType: string;
  targetId: string;
  compact?: boolean;
}

export function ReactionBar({ targetType, targetId, compact = false }: ReactionBarProps) {
  const qc = useQueryClient();
  const qKey = ["reactions", targetType, targetId];
  const [reacted, setReacted] = useState<Set<string>>(() => getLocalReacted(targetType, targetId));
  const [popped, setPopped] = useState<string | null>(null);

  const { data: counts = {} as Record<string, number> } = useQuery<Record<string, number>>({
    queryKey: qKey,
    queryFn: async () => {
      const r = await fetch(`${BASE}/api/reactions?target_type=${encodeURIComponent(targetType)}&target_id=${encodeURIComponent(targetId)}`);
      if (!r.ok) return Object.fromEntries(EMOJIS.map(e => [e.emoji, 0]));
      return r.json();
    },
    staleTime: 30_000,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async ({ emoji, delta }: { emoji: string; delta: number }) => {
      const r = await fetch(`${BASE}/api/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_id: targetId, emoji, delta }),
      });
      if (!r.ok) throw new Error("Failed");
      return r.json() as Promise<{ count: number }>;
    },
    onMutate: async ({ emoji, delta }) => {
      await qc.cancelQueries({ queryKey: qKey });
      const prev = qc.getQueryData<Record<string, number>>(qKey);
      qc.setQueryData<Record<string, number>>(qKey, old => ({
        ...old,
        [emoji]: Math.max(0, ((old?.[emoji] ?? 0) + delta)),
      }));
      return { prev };
    },
    onError: (_e, _v, ctx: any) => {
      if (ctx?.prev) qc.setQueryData(qKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qKey });
    },
  });

  const handleClick = useCallback((emoji: string) => {
    const already = reacted.has(emoji);
    const next = new Set(reacted);
    if (already) {
      next.delete(emoji);
    } else {
      next.add(emoji);
    }
    setReacted(next);
    setLocalReacted(targetType, targetId, next);
    setPopped(emoji);
    setTimeout(() => setPopped(null), 500);
    mutation.mutate({ emoji, delta: already ? -1 : 1 });
  }, [reacted, targetType, targetId, mutation]);

  const totalReactions = EMOJIS.reduce((s, e) => s + (counts[e.emoji] ?? 0), 0);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: compact ? 6 : 8,
      flexWrap: "wrap",
      justifyContent: compact ? "flex-start" : "center",
      padding: compact ? "8px 0 4px" : "12px 0 4px",
    }}>
      {totalReactions === 0 && !compact && (
        <span style={{
          fontSize: 11,
          color: "rgba(148,163,184,0.45)",
          letterSpacing: "0.05em",
          marginRight: 4,
        }}>
          React first →
        </span>
      )}
      {EMOJIS.map(({ emoji, label }) => {
        const count = counts[emoji] ?? 0;
        const active = reacted.has(emoji);
        const isPopped = popped === emoji;
        return (
          <button
            key={emoji}
            title={label}
            onClick={() => handleClick(emoji)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: compact ? "4px 8px" : "5px 11px",
              borderRadius: 100,
              border: active
                ? "1px solid rgba(0,191,255,0.5)"
                : "1px solid rgba(255,255,255,0.1)",
              background: active
                ? "rgba(0,191,255,0.12)"
                : "rgba(255,255,255,0.04)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              transform: isPopped ? "scale(1.25)" : "scale(1)",
              boxShadow: active ? "0 0 12px rgba(0,191,255,0.2)" : "none",
              userSelect: "none",
            }}
            onMouseEnter={e => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }
            }}
          >
            <span style={{ fontSize: compact ? 14 : 16, lineHeight: 1 }}>{emoji}</span>
            {count > 0 && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: active ? "rgba(0,191,255,0.9)" : "rgba(148,163,184,0.7)",
              }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
