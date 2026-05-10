import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const DATA_FILE = path.join(process.cwd(), "data", "legal.json");

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

router.get("/legal/:page", (req, res) => {
  const { page } = req.params;
  if (page !== "politique-de-retour" && page !== "mentions-legales") {
    return res.status(404).json({ error: "Page inconnue" });
  }
  const data = readData();
  res.json(data[page]);
});

router.put("/admin/legal/:page", adminAuth, (req, res) => {
  const { page } = req.params;
  if (page !== "politique-de-retour" && page !== "mentions-legales") {
    return res.status(404).json({ error: "Page inconnue" });
  }
  const data = readData();
  data[page] = req.body;
  writeData(data);
  res.json(data[page]);
});

export default router;
