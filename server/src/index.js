import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import catHealthRoutes from "./routes/catHealthRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webBuildPath = path.resolve(__dirname, "../..", "build");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (origin === env.clientOrigin) return callback(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      if (/^https:\/\/.*onrender\.com$/.test(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString(), db: "fake-json-db" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cat-health", catHealthRoutes);
app.use("/api/community", communityRoutes);

app.use(express.static(webBuildPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(webBuildPath, "index.html"), (err) => {
    if (err) res.status(404).json({ message: "Frontend build not found. Run npm run build." });
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
