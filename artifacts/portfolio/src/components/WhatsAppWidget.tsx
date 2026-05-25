import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "9779802485583";
const DEFAULT_MESSAGE = encodeURIComponent("Hi Bishal! I visited your portfolio and I'm interested in your web development services. Can we discuss my project?");

export function WhatsAppWidget() {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [tooltip, setTooltip] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500);
    const t2 = setTimeout(() => setTooltip(false), 7000);
    const t3 = setTimeout(() => setPulse(false), 10000);
    return () => { clearTimeout(t); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.8)", transition: "opacity 0.4s ease, transform 0.4s ease" }}
    >
      {tooltip && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-2xl animate-fade-in-up"
          style={{ background: "#25D366", color: "white", maxWidth: 220, boxShadow: "0 8px 32px rgba(37,211,102,0.4)" }}
        >
          <span>💬</span>
          <span>Chat with me on WhatsApp!</span>
          <button onClick={() => setTooltip(false)} style={{ marginLeft: 4, opacity: 0.7 }}>✕</button>
        </div>
      )}

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center rounded-full shadow-2xl"
        style={{ width: 60, height: 60, background: "#25D366", boxShadow: "0 8px 32px rgba(37,211,102,0.5)" }}
      >
        {pulse && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(37,211,102,0.4)" }} />
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(37,211,102,0.2)", animationDelay: "0.3s" }} />
          </>
        )}
        <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.444.655 4.738 1.796 6.718L2 30l7.55-1.773A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5c-2.226 0-4.31-.596-6.102-1.638l-.437-.26-4.48 1.053 1.08-4.36-.286-.454A11.465 11.465 0 0 1 4.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.617c-.344-.172-2.04-1.006-2.355-1.12-.315-.114-.544-.172-.773.172-.229.344-.886 1.12-1.086 1.35-.2.229-.4.258-.744.086-.344-.172-1.452-.535-2.765-1.706-1.022-.912-1.713-2.04-1.913-2.384-.2-.344-.021-.53.15-.702.155-.154.344-.4.516-.601.172-.201.229-.344.344-.573.115-.23.057-.43-.028-.602-.086-.172-.773-1.864-1.058-2.553-.279-.672-.562-.58-.773-.591l-.659-.011a1.264 1.264 0 0 0-.916.43c-.315.344-1.2 1.173-1.2 2.86 0 1.688 1.229 3.318 1.4 3.547.172.229 2.42 3.697 5.863 5.185.82.354 1.46.566 1.958.724.823.26 1.572.223 2.163.135.66-.099 2.04-.834 2.327-1.638.286-.803.286-1.49.2-1.638-.086-.143-.315-.229-.659-.4z" />
        </svg>
      </a>
    </div>
  );
}
