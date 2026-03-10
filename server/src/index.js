import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import recallRoutes from "./routes/recallRoutes.js";

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/recalls", recallRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

connectDb()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`API running on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
