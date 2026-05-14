import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sanitizeCatalogueItem } from "../lib/sanitize.js";
import { translateToAll } from "../lib/translate.js";
import { logger } from "../lib/logger.js";
import CATALOGUE_TRANSLATIONS from "../lib/catalogue-translations.js";

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

function isBadTranslation(v: unknown, source?: string): boolean {
  if (!v || typeof v !== "string") return true;
  if (v.startsWith("QUERY LENGTH LIMIT") || v.startsWith("MYMEMORY WARNING")) return true;
  if (source && v.trim() === source.trim()) return true;
  return false;
}

let catalogueBackfillRunning = false;

export async function backfillCatalogue() {
  if (catalogueBackfillRunning) return;
  catalogueBackfillRunning = true;
  logger.info("Catalogue backfill: démarrage");
  try {
    const items = readData();
    let changed = false;
    for (const item of items) {
      if (isBadTranslation(item.name_en, item.name)) item.name_en = "";
      if (isBadTranslation(item.name_es, item.name)) item.name_es = "";
      if (isBadTranslation(item.desc_en, item.desc)) item.desc_en = "";
      if (isBadTranslation(item.desc_es, item.desc)) item.desc_es = "";

      // On capture le flag AVANT toute modification — clé pour la logique ci-dessous
      const wasStale = item.translationStale === true;

      // 1. Traductions embarquées — toujours appliquées en priorité (traductions vérifiées manuellement)
      const bundled = CATALOGUE_TRANSLATIONS[item.name as string];
      if (bundled && bundled.name_en && bundled.name_es) {
        const before = `${item.name_en}|${item.name_es}|${item.desc_en}|${item.desc_es}`;
        item.name_en = bundled.name_en;
        item.name_es = bundled.name_es;
        if (bundled.desc_en) item.desc_en = bundled.desc_en;
        if (bundled.desc_es) item.desc_es = bundled.desc_es;
        // NOTE : on ne touche pas translationStale ici — la desc peut encore être périmée
        const after = `${item.name_en}|${item.name_es}|${item.desc_en}|${item.desc_es}`;
        if (before !== after) { changed = true; logger.info({ name: item.name }, "Catalogue backfill: traductions embarquées appliquées"); }
      }

      // 2. Traduction via API externe si champs vides OU si desc périmée (wasStale)
      const needsName = !item.name_en || !item.name_es;
      const needsDesc = item.desc && (!item.desc_en || !item.desc_es);
      const needsTranslation = needsName || needsDesc || wasStale;
      if (needsTranslation) {
        try {
          logger.info({ name: item.name, wasStale }, "Catalogue backfill: traduction via API externe");
          const [nameT, descT] = await Promise.all([
            (needsName || wasStale) ? translateToAll(item.name) : Promise.resolve({ en: item.name_en || "", es: item.name_es || "" }),
            item.desc && (needsDesc || wasStale) ? translateToAll(item.desc) : Promise.resolve({ en: item.desc_en || "", es: item.desc_es || "" }),
          ]);
          if (needsName || wasStale) { item.name_en = nameT.en; item.name_es = nameT.es; }
          if (item.desc && (needsDesc || wasStale)) { item.desc_en = descT.en; item.desc_es = descT.es; }
          item.translationStale = false;
          changed = true;
        } catch (err) {
          logger.error({ err, name: item.name }, "Catalogue backfill: erreur traduction API externe");
        }
      }
    }
    if (changed) writeData(items);
    logger.info({ changed }, "Catalogue backfill: terminé");
  } catch (err) {
    logger.error({ err }, "Catalogue backfill: erreur critique");
  } finally {
    catalogueBackfillRunning = false;
  }
}

router.get("/catalogue", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const items = readData();
  res.json(items);
  const needsBackfill = items.some((item: any) =>
    isBadTranslation(item.name_en, item.name) || isBadTranslation(item.name_es, item.name) ||
    isBadTranslation(item.desc_en, item.desc) || isBadTranslation(item.desc_es, item.desc) ||
    !item.name_en || !item.name_es || !item.desc_en || !item.desc_es ||
    item.translationStale === true
  );
  if (needsBackfill) backfillCatalogue().catch(() => {});
});

router.post("/catalogue", adminAuth, async (req, res) => {
  const items = readData();
  const sanitized = sanitizeCatalogueItem(req.body);
  if (!sanitized.name) return res.status(400).json({ error: "Nom requis" });

  const newItem = {
    ...sanitized,
    name_en: "",
    name_es: "",
    desc_en: "",
    desc_es: "",
    id: Date.now(),
  };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);

  // Traduction en arrière-plan — ne bloque pas la réponse
  Promise.all([
    translateToAll(sanitized.name),
    sanitized.desc ? translateToAll(sanitized.desc) : Promise.resolve({ en: "", es: "" }),
  ]).then(([nameT, descT]) => {
    const all = readData();
    const i = all.findIndex((x: any) => x.id === newItem.id);
    if (i !== -1) {
      all[i].name_en = nameT.en;
      all[i].name_es = nameT.es;
      all[i].desc_en = descT.en;
      all[i].desc_es = descT.es;
      writeData(all);
    }
  }).catch(() => {});
});

router.put("/catalogue/:id", adminAuth, async (req, res) => {
  const items = readData();
  const idx = items.findIndex((i: any) => i.id === Number(req.params["id"]));
  if (idx === -1) return res.status(404).json({ error: "Non trouvé" });

  const sanitized = sanitizeCatalogueItem({ ...items[idx], ...req.body });

  const nameChanged = sanitized.name !== items[idx].name;
  const descChanged = sanitized.desc !== items[idx].desc;
  const itemId = items[idx].id;

  // On conserve les traductions existantes — elles seront remplacées si la traduction réussit
  const existingNameT = { en: items[idx].name_en || "", es: items[idx].name_es || "" };
  const existingDescT = { en: items[idx].desc_en || "", es: items[idx].desc_es || "" };

  items[idx] = {
    ...sanitized,
    name_en: existingNameT.en,
    name_es: existingNameT.es,
    desc_en: existingDescT.en,
    desc_es: existingDescT.es,
    // Si le texte a changé, on marque comme périmé pour que le backfill retente
    translationStale: nameChanged || descChanged ? true : (items[idx].translationStale ?? false),
    id: itemId,
  };
  writeData(items);
  res.json(items[idx]);

  // Traduction en arrière-plan — ne bloque pas la réponse
  if (nameChanged || descChanged) {
    Promise.all([
      nameChanged ? translateToAll(sanitized.name) : Promise.resolve(existingNameT),
      descChanged && sanitized.desc ? translateToAll(sanitized.desc) : Promise.resolve(existingDescT),
    ]).then(([nameT, descT]) => {
      const all = readData();
      const i = all.findIndex((x: any) => x.id === itemId);
      if (i !== -1) {
        all[i].name_en = nameT.en;
        all[i].name_es = nameT.es;
        all[i].desc_en = descT.en;
        all[i].desc_es = descT.es;
        all[i].translationStale = false;
        writeData(all);
      }
    }).catch(() => {});
  }
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
