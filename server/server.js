require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Middleware
// ============================================
app.use(helmet());
app.use(morgan("combined"));
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://codconnect.ma",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", apiLimiter);

// Static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================
// Routes
// ============================================
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const trainingRoutes = require("./routes/training");
const serviceRoutes = require("./routes/services");
const distributionRoutes = require("./routes/distribution");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/distribution", distributionRoutes);
app.use("/api/stats", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`✅ CodConnect API running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth test: http://localhost:${PORT}/api/auth/test`);
});
