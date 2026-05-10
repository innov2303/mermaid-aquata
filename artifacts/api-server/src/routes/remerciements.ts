import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sanitizeRemerciement } from "../lib/sanitize.js";
import { translateToAll } from "../lib/translate.js";

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

router.get("/remerciements", async (_req, res) => {
  const items = readData();

  for (const item of items) {
    if (isBadTranslation(item.review_en, item.review)) item.review_en = null;
    if (isBadTranslation(item.review_es, item.review)) item.review_es = null;
  }

  const needsBackfill = items.some((item: any) => item.review && (!item.review_en || !item.review_es));

  if (needsBackfill) {
    let changed = false;
    for (const item of items) {
      if (item.review && (!item.review_en || !item.review_es)) {
        try {
          const t = await translateToAll(item.review);
          item.review_en = t.en;
          item.review_es = t.es;
          changed = true;
        } catch {
        }
      }
    }
    if (changed) writeData(items);
  }

  res.json(items);
});

router.post("/remerciements", adminAuth, async (req, res) => {
  const items = readData();
  const sanitized = sanitizeRemerciement(req.body);
  if (!sanitized.name) return res.status(400).json({ error: "Nom requis" });

  const reviewT = sanitized.review
    ? await translateToAll(sanitized.review)
    : { en: null, es: null };

  const newItem = {
    ...sanitized,
    review_en: reviewT.en,
    review_es: reviewT.es,
    id: Date.now(),
  };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

router.put("/remerciements/:id", adminAuth, async (req, res) => {
  const items = readData();
  const idx = items.findIndex((i: any) => i.id === Number(req.params["id"]));
  if (idx === -1) return res.status(404).json({ error: "Non trouvé" });

  const sanitized = sanitizeRemerciement({ ...items[idx], ...req.body });

  const reviewChanged = sanitized.review !== items[idx].review;
  const reviewT = reviewChanged && sanitized.review
    ? await translateToAll(sanitized.review)
    : { en: items[idx].review_en ?? null, es: items[idx].review_es ?? null };

  items[idx] = {
    ...sanitized,
    review_en: reviewT.en,
    review_es: reviewT.es,
    id: items[idx].id,
  };
  writeData(items);
  res.json(items[idx]);
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
