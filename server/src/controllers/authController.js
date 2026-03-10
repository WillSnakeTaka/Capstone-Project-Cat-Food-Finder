import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: role === "seller" ? "seller" : "buyer" });
  const token = signToken(user);

  return res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password || "", user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export async function me(req, res) {
  return res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
}
