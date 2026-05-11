import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sanitizeRemerciement } from "../lib/sanitize.js";
import { translateToAll } from "../lib/translate.js";
import { logger } from "../lib/logger.js";

const router = Router();
const DATA_FILE = path.join(process.cwd(), "data", "remerciements.json");

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}
function writeData(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"];
  const secret = process.env["ADMIN_SECRET"] || "mermaid-admin";
  if (token !== secret) return res.status(401).json({ error: "Non autorisé" });
  next();
}

function isBadTranslation(v: unknown, source?: string): boolean {
  if (!v || typeof v !== "string") return true;
  if (v.startsWith("QUERY LENGTH LIMIT") || v.startsWith("MYMEMORY WARNING")) return true;
  if (source && v.trim() === source.trim()) return true;
  return false;
}

let remerciementsBackfillRunning = false;

export async function backfillRemerciements() {
  if (remerciementsBackfillRunning) return;
  remerciementsBackfillRunning = true;
  logger.info("Remerciements backfill: démarrage");
  try {
    const items = readData();
    let changed = false;
    for (const item of items) {
      if (isBadTranslation(item.review_en, item.review)) item.review_en = null;
      if (isBadTranslation(item.review_es, item.review)) item.review_es = null;
      if (item.review && (!item.review_en || !item.review_es)) {
        try {
          logger.info({ nom: item.nom }, "Remerciements backfill: traduction avis");
          const t = await translateToAll(item.review);
          item.review_en = t.en;
          item.review_es = t.es;
          changed = true;
        } catch (err) {
          logger.error({ err, nom: item.nom }, "Remerciements backfill: erreur traduction");
        }
      }
    }
    if (changed) writeData(items);
    logger.info({ changed }, "Remerciements backfill: terminé");
  } catch (err) {
    logger.error({ err }, "Remerciements backfill: erreur critique");
  } finally {
    remerciementsBackfillRunning = false;
  }
}

router.get("/remerciements", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const items = readData();
  res.json(items);
  const needsBackfill = items.some((item: any) =>
    item.review && (isBadTranslation(item.review_en, item.review) || isBadTranslation(item.review_es, item.review) || !item.review_en || !item.review_es)
  );
  if (needsBackfill) backfillRemerciements().catch(() => {});
});

router.post("/remerciements", adminAuth, async (req, res) => {
  const items = readData();
  const sanitized = sanitizeRemerciement(req.body);
  if (!sanitized.name) return res.status(400).json({ error: "Nom requis" });

  const newItem = {
    ...sanitized,
    review_en: null as string | null,
    review_es: null as string | null,
    id: Date.now(),
  };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);

  // Traduction en arrière-plan — ne bloque pas la réponse
  if (sanitized.review) {
    translateToAll(sanitized.review).then((reviewT) => {
      const all = readData();
      const i = all.findIndex((x: any) => x.id === newItem.id);
      if (i !== -1) {
        all[i].review_en = reviewT.en;
        all[i].review_es = reviewT.es;
        writeData(all);
      }
    }).catch(() => {});
  }
});

router.put("/remerciements/:id", adminAuth, async (req, res) => {
  const items = readData();
  const idx = items.findIndex((i: any) => i.id === Number(req.params["id"]));
  if (idx === -1) return res.status(404).json({ error: "Non trouvé" });

  const sanitized = sanitizeRemerciement({ ...items[idx], ...req.body });

  const reviewChanged = sanitized.review !== items[idx].review;
  const itemId = items[idx].id;

  items[idx] = {
    ...sanitized,
    review_en: reviewChanged ? null : (items[idx].review_en ?? null),
    review_es: reviewChanged ? null : (items[idx].review_es ?? null),
    id: itemId,
  };
  writeData(items);
  res.json(items[idx]);

  // Traduction en arrière-plan — ne bloque pas la réponse
  if (reviewChanged && sanitized.review) {
    translateToAll(sanitized.review).then((reviewT) => {
      const all = readData();
      const i = all.findIndex((x: any) => x.id === itemId);
      if (i !== -1) {
        all[i].review_en = reviewT.en;
        all[i].review_es = reviewT.es;
        writeData(all);
      }
    }).catch(() => {});
  }
});

router.delete("/remerciements/:id", adminAuth, (req, res) => {
  let items = readData();
  const before = items.length;
  items = items.filter((i: any) => i.id !== Number(req.params["id"]));
  if (items.length === before) return res.status(404).json({ error: "Non trouvé" });
  writeData(items);
  res.json({ ok: true });
});

export default router;
