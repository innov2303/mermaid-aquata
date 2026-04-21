import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Format non supporté. Utilisez JPG, PNG, WebP ou GIF."));
  },
});

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"];
  const secret = process.env["ADMIN_SECRET"] || "mermaid-admin";
  if (token !== secret) return res.status(401).json({ error: "Non autorisé" });
  next();
}

router.post("/upload", adminAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  const url = `/api/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

router.get("/uploads", adminAuth, (_req, res) => {
  const files = fs.readdirSync(UPLOADS_DIR).map(f => ({ filename: f, url: `/api/uploads/${f}` }));
  res.json(files);
});

router.delete("/uploads/:filename", adminAuth, (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Fichier introuvable" });
  fs.unlinkSync(filePath);
  res.json({ ok: true });
});

export default router;
