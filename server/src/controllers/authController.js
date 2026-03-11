import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../data/fakeDb.js";
import { signToken } from "../utils/jwt.js";

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "password must be at least 6 characters" });
  }

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    passwordHash,
    role: role === "seller" ? "seller" : "buyer",
  });

  return res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email || "");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password || "", user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({ token: signToken(user), user: toPublicUser(user) });
}

export async function me(req, res) {
  return res.json({ user: toPublicUser(req.user) });
}
