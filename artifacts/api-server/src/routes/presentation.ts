import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sanitizeString } from "../lib/sanitize.js";

const router = Router();
const DATA_FILE = path.join(process.cwd(), "data", "presentation.json");

function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
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

router.get("/presentation", (_req, res) => {
  res.json(readData());
});

router.post("/presentation", adminAuth, (req, res) => {
  const items = readData();
  const sanitized = {
    url: sanitizeString(req.body.url || "", 500),
    alt: sanitizeString(req.body.alt || "", 200),
  };
  if (!sanitized.url) return res.status(400).json({ error: "URL requise" });
  const newItem = { ...sanitized, id: Date.now() };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

router.put("/presentation/:id", adminAuth, (req, res) => {
  const items = readData();
  const idx = items.findIndex((i: any) => i.id === Number(req.params["id"]));
  if (idx === -1) return res.status(404).json({ error: "Non trouvé" });
  items[idx] = {
    id: items[idx].id,
    url: sanitizeString(req.body.url ?? items[idx].url, 500),
    alt: sanitizeString(req.body.alt ?? items[idx].alt, 200),
  };
  writeData(items);
  res.json(items[idx]);
});

router.delete("/presentation/:id", adminAuth, (req, res) => {
  let items = readData();
  const before = items.length;
  items = items.filter((i: any) => i.id !== Number(req.params["id"]));
  if (items.length === before) return res.status(404).json({ error: "Non trouvé" });
  writeData(items);
  res.json({ ok: true });
});

export default router;
