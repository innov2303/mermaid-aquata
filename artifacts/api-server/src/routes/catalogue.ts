import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sanitizeCatalogueItem } from "../lib/sanitize.js";
import { translateToAll } from "../lib/translate.js";

const router = Router();
const DATA_FILE = path.join(process.cwd(), "data", "catalogue.json");

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

function isBadTranslation(v: unknown): boolean {
  if (!v || typeof v !== "string") return true;
  return v.startsWith("QUERY LENGTH LIMIT") || v.startsWith("MYMEMORY WARNING");
}

router.get("/catalogue", async (_req, res) => {
  const items = readData();

  for (const item of items) {
    if (isBadTranslation(item.name_en)) item.name_en = "";
    if (isBadTranslation(item.name_es)) item.name_es = "";
    if (isBadTranslation(item.desc_en)) item.desc_en = "";
    if (isBadTranslation(item.desc_es)) item.desc_es = "";
  }

  const needsBackfill = items.some((item: any) => !item.name_en || !item.name_es || !item.desc_en || !item.desc_es);

  if (needsBackfill) {
    let changed = false;
    for (const item of items) {
      if (!item.name_en || !item.name_es || !item.desc_en || !item.desc_es) {
        try {
          const [nameT, descT] = await Promise.all([
            (!item.name_en || !item.name_es) ? translateToAll(item.name) : Promise.resolve({ en: item.name_en || "", es: item.name_es || "" }),
            item.desc && (!item.desc_en || !item.desc_es) ? translateToAll(item.desc) : Promise.resolve({ en: item.desc_en || "", es: item.desc_es || "" }),
          ]);
          item.name_en = nameT.en;
          item.name_es = nameT.es;
          item.desc_en = descT.en;
          item.desc_es = descT.es;
          changed = true;
        } catch {
        }
      }
    }
    if (changed) writeData(items);
  }

  res.json(items);
});

router.post("/catalogue", adminAuth, async (req, res) => {
  const items = readData();
  const sanitized = sanitizeCatalogueItem(req.body);
  if (!sanitized.name) return res.status(400).json({ error: "Nom requis" });

  const [nameT, descT] = await Promise.all([
    translateToAll(sanitized.name),
    sanitized.desc ? translateToAll(sanitized.desc) : Promise.resolve({ en: "", es: "" }),
  ]);

  const newItem = {
    ...sanitized,
    name_en: nameT.en,
    name_es: nameT.es,
    desc_en: descT.en,
    desc_es: descT.es,
    id: Date.now(),
  };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

router.put("/catalogue/:id", adminAuth, async (req, res) => {
  const items = readData();
  const idx = items.findIndex((i: any) => i.id === Number(req.params["id"]));
  if (idx === -1) return res.status(404).json({ error: "Non trouvé" });

  const sanitized = sanitizeCatalogueItem({ ...items[idx], ...req.body });

  const nameChanged = sanitized.name !== items[idx].name;
  const descChanged = sanitized.desc !== items[idx].desc;

  const [nameT, descT] = await Promise.all([
    nameChanged ? translateToAll(sanitized.name) : Promise.resolve({ en: items[idx].name_en || "", es: items[idx].name_es || "" }),
    descChanged && sanitized.desc ? translateToAll(sanitized.desc) : Promise.resolve({ en: items[idx].desc_en || "", es: items[idx].desc_es || "" }),
  ]);

  items[idx] = {
    ...sanitized,
    name_en: nameT.en,
    name_es: nameT.es,
    desc_en: descT.en,
    desc_es: descT.es,
    id: items[idx].id,
  };
  writeData(items);
  res.json(items[idx]);
});

router.delete("/catalogue/:id", adminAuth, (req, res) => {
  let items = readData();
  const before = items.length;
  items = items.filter((i: any) => i.id !== Number(req.params["id"]));
  if (items.length === before) return res.status(404).json({ error: "Non trouvé" });
  writeData(items);
  res.json({ ok: true });
});

export default router;
