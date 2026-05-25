import { useState, useEffect } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-[5.5rem] right-6 z-[9998] flex items-center justify-center rounded-full transition-all duration-300"
      style={{
        width: 44, height: 44,
        background: "rgba(6,182,212,0.15)",
        border: "1px solid rgba(6,182,212,0.4)",
        color: "#06b6d4",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.8) translateY(8px)",
        pointerEvents: visible ? "auto" : "none",
        backdropFilter: "blur(8px)",
        boxShadow: visible ? "0 0 20px rgba(6,182,212,0.25)" : "none",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
