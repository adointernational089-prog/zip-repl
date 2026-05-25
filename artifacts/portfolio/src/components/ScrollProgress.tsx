import { useState, useEffect } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-[3px] pointer-events-none" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div
        className="h-full transition-none"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #06b6d4, #2563eb, #7c3aed)",
          boxShadow: "0 0 10px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.4)",
        }}
      />
    </div>
  );
}
