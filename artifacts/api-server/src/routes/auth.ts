import { Router, type Request, type Response, type NextFunction } from "express";

const router = Router();

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"];
  const secret = process.env["ADMIN_SECRET"] || "mermaid-admin";
  if (token !== secret) return res.status(401).json({ error: "Non autorisé" });
  next();
}

router.get("/auth/check", adminAuth, (_req, res) => {
  res.json({ ok: true });
});

export default router;
