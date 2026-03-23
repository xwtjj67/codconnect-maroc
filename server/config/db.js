const { Pool } = require("pg");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "codconnect_db",
  user: process.env.DB_USER || "codconnect_user",
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

// Log DB config on startup (hide password)
console.log("📦 Database config:", {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password ? "***SET***" : "❌ NOT SET",
});

const pool = new Pool(dbConfig);

pool.on("connect", () => {
  console.log(`✅ Connected to PostgreSQL → ${dbConfig.database}`);
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL error:", err.message);
});

// Test connection on startup
pool.query("SELECT NOW() as time, current_database() as db")
  .then((res) => {
    console.log(`✅ DB verified: ${res.rows[0].db} at ${res.rows[0].time}`);
  })
  .catch((err) => {
    console.error("❌ DB connection FAILED:", err.message);
  });

module.exports = pool;
