import app from "./app";
import { logger } from "./lib/logger";
import { backfillCatalogue } from "./routes/catalogue.js";
import { backfillRemerciements } from "./routes/remerciements.js";

const rawPort = process.env["PORT"] ?? "8080";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Traduire les items non traduits dès le démarrage (arrière-plan)
  setTimeout(() => {
    backfillCatalogue().catch((e) => logger.error({ err: e }, "Startup backfill catalogue"));
    backfillRemerciements().catch((e) => logger.error({ err: e }, "Startup backfill remerciements"));
  }, 3000);
});
