import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sanitizeContact } from "../lib/sanitize.js";

const router = Router();
const DATA_FILE = path.join(process.cwd(), "data", "contact.json");

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

router.get("/contact-info", (_req, res) => {
  res.json(readData());
});

router.put("/contact-info", adminAuth, (req, res) => {
  const current = readData();
  const sanitized = sanitizeContact({ ...current, ...req.body });
  writeData(sanitized);
  res.json(sanitized);
});

export default router;
