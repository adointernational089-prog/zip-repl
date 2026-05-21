import bcrypt from "bcryptjs";
import { getSupabase } from "./db.js";
import { logger } from "./logger.js";

const ADMIN_EMAIL    = "bishalbishwokarma089@gmail.com";
const ADMIN_NAME     = "Bishal Bishwokarma";
const ADMIN_PASSWORD = "bishal@ado@9802485583";

/**
 * Automatically ensures the admin user exists in the database.
 * Runs once at server startup — no manual setup-admin command needed.
 */
export async function autoSetupAdmin(): Promise<void> {
  try {
    const sb = getSupabase();

    const { data: existing } = await sb
      .from("users")
      .select("id, role")
      .eq("email", ADMIN_EMAIL)
      .limit(1)
      .single();

    if (!existing) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      const { error } = await sb.from("users").insert({
        email:         ADMIN_EMAIL,
        name:          ADMIN_NAME,
        password_hash: passwordHash,
        role:          "admin",
      });
      if (error) throw error;
      logger.info("✓ Admin user created automatically");
    } else {
      if (existing.role !== "admin") {
        await sb.from("users").update({ role: "admin" }).eq("email", ADMIN_EMAIL);
        logger.info("✓ Admin role restored");
      } else {
        logger.info("✓ Admin user already exists");
      }
    }
  } catch (err) {
    // Never crash the server — just warn so the app still starts
    logger.warn({ err }, "Auto-setup: could not verify admin user (DB may not be ready yet)");
  }
}
