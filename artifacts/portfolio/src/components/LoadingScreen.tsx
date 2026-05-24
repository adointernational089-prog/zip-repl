import { useEffect, useState } from "react";

const NAME = "BISHAL BISHWOKARMA";

interface LoadingScreenProps {
  onDone: () => void;
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(tickInterval); return 100; }
        const increment = p < 60 ? 3 : p < 85 ? 1.5 : 0.8;
        return Math.min(100, p + increment);
      });
    }, 30);

    const outTimer = setTimeout(() => setFadeOut(true), 2400);
    const doneTimer = setTimeout(() => onDone(), 3000);

    return () => {
      clearInterval(tickInterval);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#06060f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      <style>{`
        @keyframes bb-letter {
          0%   { opacity: 0; transform: translateY(14px) scale(0.85); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0);  }
        }
        @keyframes bb-logo-in {
          0%   { opacity: 0; transform: scale(0.7) translateY(20px); }
          60%  { opacity: 1; transform: scale(1.05) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bb-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes bb-tagline {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0);   }
        }
        @keyframes bb-scan {
          0%   { top: -2px; opacity: 0.6; }
          50%  { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes bb-glow-pulse {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50%       { opacity: 0.22; transform: scale(1.08); }
        }
      `}</style>

      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(0,191,255,0.025) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(0,191,255,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,191,255,0.14) 0%, transparent 70%)",
        filter: "blur(40px)",
        animation: "bb-glow-pulse 2.4s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        filter: "blur(30px)", top: "60%", left: "55%",
        animation: "bb-glow-pulse 3s ease-in-out infinite",
        animationDelay: "1.2s",
      }} />

      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(0,191,255,0.5) 50%, transparent 100%)",
        animation: "bb-scan 2.2s linear infinite",
        zIndex: 1,
      }} />

      {/* Logo */}
      <div style={{
        position: "relative", zIndex: 2,
        width: 90, height: 90, borderRadius: 22,
        background: "linear-gradient(135deg, rgba(0,191,255,0.18) 0%, rgba(0,191,255,0.04) 100%)",
        border: "1px solid rgba(0,191,255,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 32,
        boxShadow: "0 0 0 1px rgba(0,191,255,0.08), 0 0 40px rgba(0,191,255,0.2), inset 0 0 24px rgba(0,191,255,0.06)",
        animation: "bb-logo-in 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards, bb-float 3.2s ease-in-out 0.8s infinite",
        opacity: 0,
        animationFillMode: "forwards",
      }}>
        <img
          src="/scorpion-favicon.svg"
          alt=""
          style={{
            width: 54, height: 54,
            filter: "drop-shadow(0 0 10px rgba(0,191,255,0.9)) drop-shadow(0 0 24px rgba(0,191,255,0.4))",
          }}
        />
      </div>

      {/* Name letters */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexWrap: "wrap", gap: 1, marginBottom: 14,
        maxWidth: 440,
      }}>
        {NAME.split("").map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: char === " " ? "0.6em" : "0.12em",
              color: char === " " ? "transparent" : "rgba(0,191,255,0.95)",
              textShadow: char === " " ? "none" : "0 0 16px rgba(0,191,255,0.8), 0 0 32px rgba(0,191,255,0.3)",
              opacity: 0,
              animation: "bb-letter 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
              animationDelay: `${0.5 + i * 0.055}s`,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p style={{
        position: "relative", zIndex: 2,
        fontSize: 11,
        fontFamily: "'Courier New', Courier, monospace",
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: "rgba(148,163,184,0.65)",
        marginBottom: 56,
        opacity: 0,
        animation: "bb-tagline 0.5s ease forwards",
        animationDelay: "1.65s",
      }}>
        Full Stack Developer · Nepal
      </p>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: "rgba(0,191,255,0.08)",
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, rgba(0,191,255,0.3), #00BFFF)",
          boxShadow: "0 0 10px #00BFFF, 0 0 20px rgba(0,191,255,0.5)",
          transition: "width 0.03s linear",
          borderRadius: "0 2px 2px 0",
        }} />
      </div>

      {/* Corner dots */}
      {[
        { top: 16, left: 16 }, { top: 16, right: 16 },
        { bottom: 16, left: 16 }, { bottom: 16, right: 16 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos,
          width: 4, height: 4, borderRadius: "50%",
          background: "rgba(0,191,255,0.4)",
          boxShadow: "0 0 6px rgba(0,191,255,0.6)",
        }} />
      ))}
    </div>
  );
}
