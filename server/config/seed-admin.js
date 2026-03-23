/**
 * Seed default admin user
 * Usage: cd /home/codconnect/server && node config/seed-admin.js
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./db");

async function seedAdmin() {
  const email = "admin@codconnect.ma";
  const password = "Admin123!";
  const username = "admin";
  const name = "Admin";

  try {
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      console.log("⚠️  Admin already exists, skipping...");
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 12);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, username, name)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [email, hash, username, name]
    );
    const userId = result.rows[0].id;

    await db.query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'admin')", [userId]);
    await db.query("INSERT INTO user_statuses (user_id, status) VALUES ($1, 'active')", [userId]);

    // Try subscriptions (may not exist yet)
    try {
      await db.query("INSERT INTO subscriptions (user_id, plan) VALUES ($1, 'vip')", [userId]);
    } catch (e) {
      console.log("⚠️  Subscriptions table not found, skipping");
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
