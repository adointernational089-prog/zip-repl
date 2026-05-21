import app from "./app.js";
import { logger } from "./lib/logger.js";
import { autoSetupAdmin } from "./lib/auto-setup.js";

const port = Number(process.env.PORT ?? "3000");

app.listen(port, async () => {
  logger.info({ port }, "Server listening — http://localhost:" + port);
  await autoSetupAdmin();
});
