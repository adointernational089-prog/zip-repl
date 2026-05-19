import { Router } from "express";
import bcrypt from "bcryptjs";
import { getSupabase } from "../lib/db.js";
import { signToken } from "../lib/auth.js";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();
const ADMIN_EMAIL = "bishalbishwokarma089@gmail.com";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("users").select("*").eq("email", email).limit(1).single();
    if (error || !data) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const isValid = await bcrypt.compare(password, data.password_hash);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken({ userId: data.id, email: data.email, role: data.role });
    res.json({ token, user: { id: data.id, email: data.email, name: data.name, role: data.role, created_at: data.created_at } });
  } catch (err) {
    req.log?.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: "Email, password and name required" });
    return;
  }
  try {
    const sb = getSupabase();
    const { data: existing } = await sb.from("users").select("id").eq("email", email).limit(1).single();
    if (existing) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const role = email === ADMIN_EMAIL ? "admin" : "user";
    const { data, error } = await sb
      .from("users")
      .insert({ email, name, password_hash: passwordHash, role })
      .select("id, email, name, role, created_at")
      .single();
    if (error || !data) {
      req.log?.error({ err: error }, "Register insert error");
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const token = signToken({ userId: data.id, email: data.email, role: data.role });
    res.status(201).json({ token, user: data });
  } catch (err) {
    req.log?.error({ err }, "Register error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("users")
      .select("id, email, name, role, created_at")
      .eq("id", req.user!.userId)
      .single();
    if (error || !data) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    res.json(data);
  } catch (err) {
    req.log?.error({ err }, "Get me error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
