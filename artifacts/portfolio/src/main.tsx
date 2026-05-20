import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// VITE_API_BASE_URL takes priority (set this in any deployment's env vars)
const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (apiBase) {
  setBaseUrl(apiBase);
} else if (
  typeof window !== "undefined" &&
  !window.location.hostname.includes("replit") &&
  !window.location.hostname.includes("localhost") &&
  window.location.hostname !== "127.0.0.1"
) {
  // When deployed externally (e.g. Vercel), the database only lives on Replit.
  // Point all API calls at the Replit-hosted API server.
  setBaseUrl(
    (import.meta.env.VITE_REPLIT_API_URL as string) ||
      "https://3f50dad2-fde0-4e97-b7dd-cb06139ba95e-00-2dcxj1bwnr8kl.sisko.replit.dev"
  );
}

createRoot(document.getElementById("root")!).render(<App />);
