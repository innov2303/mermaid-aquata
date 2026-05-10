import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { translateToAll } from "../lib/translate.js";
import CATALOGUE_TRANSLATIONS from "../lib/catalogue-translations.js";

const router = Router();

const CATALOGUE_FILE = path.join(process.cwd(), "data", "catalogue.json");
const REMERCIEMENTS_FILE = path.join(process.cwd(), "data", "remerciements.json");

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"];
  const secret = process.env["ADMIN_SECRET"] || "mermaid-admin";
  if (token !== secret) return res.status(401).json({ error: "Non autorisé" });
  next();
}

router.post("/admin/translate-all", adminAuth, async (_req, res) => {
  const results = { catalogue: 0, remerciements: 0, errors: [] as string[] };

  // ── Catalogue ─────────────────────────────────────────────
  try {
    const items = JSON.parse(fs.readFileSync(CATALOGUE_FILE, "utf-8"));
    let changed = false;
    for (const item of items) {
      // 1. Traductions embarquées — toujours appliquées en priorité (vérifiées manuellement)
      const bundled = CATALOGUE_TRANSLATIONS[item.name as string];
      if (bundled && bundled.name_en && bundled.name_es) {
        const prev = `${item.name_en}|${item.name_es}|${item.desc_en}|${item.desc_es}`;
        item.name_en = bundled.name_en;
        item.name_es = bundled.name_es;
        if (bundled.desc_en) item.desc_en = bundled.desc_en;
        if (bundled.desc_es) item.desc_es = bundled.desc_es;
        const curr = `${item.name_en}|${item.name_es}|${item.desc_en}|${item.desc_es}`;
        if (prev !== curr) { results.catalogue++; changed = true; }
      }
      // 2. Fallback API externe pour les champs encore manquants (article hors bundle)
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
          results.catalogue++;
          changed = true;
        } catch (e: any) {
          results.errors.push(`Catalogue #${item.id}: ${e.message}`);
        }
      }
    }
    if (changed) fs.writeFileSync(CATALOGUE_FILE, JSON.stringify(items, null, 2));
  } catch (e: any) {
    results.errors.push(`Lecture catalogue: ${e.message}`);
  }

  // ── Remerciements ─────────────────────────────────────────
  try {
    const items = JSON.parse(fs.readFileSync(REMERCIEMENTS_FILE, "utf-8"));
    let changed = false;
    for (const item of items) {
      if (item.review && (!item.review_en || !item.review_es)) {
        try {
          const t = await translateToAll(item.review);
          item.review_en = t.en;
          item.review_es = t.es;
          results.remerciements++;
          changed = true;
        } catch (e: any) {
          results.errors.push(`Avis #${item.id}: ${e.message}`);
        }
      }
    }
    if (changed) fs.writeFileSync(REMERCIEMENTS_FILE, JSON.stringify(items, null, 2));
  } catch (e: any) {
    results.errors.push(`Lecture avis: ${e.message}`);
  }

  res.json({
    ok: true,
    message: `${results.catalogue} article(s) catalogue + ${results.remerciements} avis traduits.`,
    ...results,
  });
});

export default router;
