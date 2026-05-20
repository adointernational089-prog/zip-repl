import app from "./app-vercel.js";

// Export the Express app directly as the Vercel serverless handler.
// Vercel's req/res are Node.js IncomingMessage/ServerResponse compatible,
// so Express handles them natively without the serverless-http wrapper.
export default app;
