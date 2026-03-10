import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("_id name email role");

    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function requireSeller(req, res, next) {
  if (req.user?.role !== "seller") {
    return res.status(403).json({ message: "Seller account required" });
  }
  next();
}
