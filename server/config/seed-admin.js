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
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      console.log("⚠️  Admin already exists, skipping...");
      // Ensure role + status are correct
      const uid = existing.rows[0].id;
      await db.query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'admin') ON CONFLICT (user_id, role) DO NOTHING", [uid]);
      await db.query(
        `INSERT INTO user_statuses (user_id, status) VALUES ($1, 'active')
         ON CONFLICT DO NOTHING`, [uid]
      );
      // Update status to active if exists
      await db.query("UPDATE user_statuses SET status = 'active' WHERE user_id = $1", [uid]);
      console.log("✅ Admin role/status ensured");
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 12);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, username, name, phone)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [email, hash, username, name, "0000000000"]
    );
    const userId = result.rows[0].id;

    await db.query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'admin')", [userId]);
    await db.query("INSERT INTO user_statuses (user_id, status) VALUES ($1, 'active')", [userId]);

    // Try subscriptions
    try {
      await db.query("INSERT INTO subscriptions (user_id, plan) VALUES ($1, 'vip')", [userId]);
    } catch (e) {
      console.log("⚠️  Subscriptions table issue, skipping:", e.message);
    }

    console.log("✅ Admin user created:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Username: ${username}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seedAdmin();
