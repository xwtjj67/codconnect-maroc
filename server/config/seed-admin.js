/**
 * Seed default admin user
 * Usage: cd /home/codconnect/server && node config/seed-admin.js
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./db");

async function seedAdmin() {
  const email = "hachimiabdelhafid0@gmail.com";
  const password = "Allo@Abdo@2026@!";
  const username = "admin";
  const name = "Admin";

  try {
    // Check by email OR username
    const existing = await db.query(
      "SELECT id, email, username FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existing.rows.length > 0) {
      const uid = existing.rows[0].id;
      console.log("⚠️  Admin exists (id:", uid, "), updating password & ensuring role...");

      // Update password hash + email
      const hash = await bcrypt.hash(password, 12);
      await db.query(
        "UPDATE users SET email = $1, password_hash = $2, name = $3 WHERE id = $4",
        [email, hash, name, uid]
      );

      // Ensure role
      await db.query(
        "INSERT INTO user_roles (user_id, role) VALUES ($1, 'admin') ON CONFLICT (user_id, role) DO NOTHING",
        [uid]
      );

      // Ensure status = active
      const statusExists = await db.query("SELECT id FROM user_statuses WHERE user_id = $1", [uid]);
      if (statusExists.rows.length === 0) {
        await db.query("INSERT INTO user_statuses (user_id, status) VALUES ($1, 'active')", [uid]);
      } else {
        await db.query("UPDATE user_statuses SET status = 'active' WHERE user_id = $1", [uid]);
      }

      console.log("✅ Admin updated successfully");
      console.log("   Email:", email);
      console.log("   Password:", password);
      process.exit(0);
    }

    // Create new admin
    const hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      "INSERT INTO users (email, password_hash, username, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [email, hash, username, name, "0000000000"]
    );
    const userId = result.rows[0].id;

    await db.query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'admin')", [userId]);
    await db.query("INSERT INTO user_statuses (user_id, status) VALUES ($1, 'active')", [userId]);

    // Try subscriptions
    try {
      await db.query("INSERT INTO subscriptions (user_id, plan) VALUES ($1, 'vip')", [userId]);
    } catch (e) {
      console.log("⚠️  Subscriptions skipped:", e.message);
    }

    console.log("✅ Admin created:");
    console.log("   Email:", email);
    console.log("   Password:", password);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seedAdmin();
