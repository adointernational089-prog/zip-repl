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

router.post("/change-password", requireAuth, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current password and new password are required" });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("users").select("*").eq("id", req.user!.userId).single();
    if (error || !data) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const isValid = await bcrypt.compare(currentPassword, data.password_hash);
    if (!isValid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await sb
      .from("users")
      .update({ password_hash: newHash })
      .eq("id", req.user!.userId);
    if (updateError) throw updateError;
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    req.log?.error({ err }, "Change password error");
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
