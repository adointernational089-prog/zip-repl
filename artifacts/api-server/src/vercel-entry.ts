import app from "./app-vercel.js";
import { autoSetupAdmin } from "./lib/auto-setup.js";

// Auto-create admin user when the Vercel function cold-starts.
// Runs silently — never blocks requests or crashes the function.
autoSetupAdmin().catch(() => {});

// Export the Express app directly as the Vercel serverless handler.
// Vercel's req/res are Node.js IncomingMessage/ServerResponse compatible,
// so Express handles them natively without the serverless-http wrapper.
export default app;
