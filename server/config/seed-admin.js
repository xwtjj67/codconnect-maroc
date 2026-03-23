/**
 * Seed default admin user
 * Usage: node config/seed-admin.js
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
    // Check if admin exists
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      console.log("⚠️  Admin already exists, skipping...");
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 12);

    // Insert user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, username, name)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [email, hash, username, name]
    );
    const userId = result.rows[0].id;

    // Insert role
    await db.query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'admin')", [userId]);

    // Insert status (active)
    await db.query("INSERT INTO user_statuses (user_id, status) VALUES ($1, 'active')", [userId]);

    // Insert subscription
    await db.query("INSERT INTO subscriptions (user_id, plan) VALUES ($1, 'vip')", [userId]);

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
