import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sanitizeCatalogueItem } from "../lib/sanitize.js";

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

router.get("/catalogue", (_req, res) => {
  res.json(readData());
});

router.post("/catalogue", adminAuth, (req, res) => {
  const items = readData();
  const sanitized = sanitizeCatalogueItem(req.body);
  if (!sanitized.name) return res.status(400).json({ error: "Nom requis" });
  const newItem = { ...sanitized, id: Date.now() };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

router.put("/catalogue/:id", adminAuth, (req, res) => {
  const items = readData();
  const idx = items.findIndex((i: any) => i.id === Number(req.params["id"]));
  if (idx === -1) return res.status(404).json({ error: "Non trouvé" });
  const sanitized = sanitizeCatalogueItem({ ...items[idx], ...req.body });
  items[idx] = { ...sanitized, id: items[idx].id };
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
