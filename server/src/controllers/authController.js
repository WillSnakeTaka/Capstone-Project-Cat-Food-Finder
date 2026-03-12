import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { toPublicUser } from "../utils/serializers.js";

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() }).lean();
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role === "seller" ? "seller" : "buyer",
  });

  return res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || "").toLowerCase() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password || "", user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({ token: signToken(user), user: toPublicUser(user) });
}

export async function me(req, res) {
  return res.json({ user: toPublicUser(req.user) });
}
