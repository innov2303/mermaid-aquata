import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ── Trust proxy (Replit reverse proxy) ─────────────────────────────────────
app.set("trust proxy", 1);

// ── Security headers ───────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false, // évite le blocage des images cross-origin
    crossOriginOpenerPolicy: false,
  }),
);

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env["REPLIT_DOMAINS"] ?? "")
  .split(",")
  .map(d => d.trim())
  .filter(Boolean)
  .flatMap(d => [`https://${d}`, `http://${d}`]);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-admin-token"],
    credentials: false,
  }),
);

// ── Rate limiting (désactivé en développement) ─────────────────────────────
const isDev = process.env["NODE_ENV"] === "development";

// Global : 500 req / 15 min par IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, veuillez réessayer dans un moment." },
  skip: () => isDev,
});

// Auth / admin : 15 tentatives / 15 min par IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, veuillez réessayer plus tard." },
  skipSuccessfulRequests: true,
  skip: () => isDev,
});

// Upload : 30 uploads / 15 min par IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite d'upload atteinte, veuillez réessayer plus tard." },
  skip: () => isDev,
});

app.use(globalLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/uploads", uploadLimiter);

// ── Logging ────────────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── Body parsing (taille limitée) ──────────────────────────────────────────
app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true, limit: "512kb" }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api", router);

// Serve uploaded images statically
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── 404 catch-all ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

export default app;
