import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { fileURLToPath } from "url";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use("/api", router);

// In production, serve the compiled React frontend from the same server.
// This makes the app a single deployable unit (no separate static host needed).
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const frontendDist = path.resolve(__dirname, "../../portfolio/dist/public");
  app.use(express.static(frontendDist));
  app.get("*splat", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
