const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "codconnect-secret-key";

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "غير مصرح - يرجى تسجيل الدخول" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from DB
    const result = await db.query(
      `SELECT u.id, u.email, u.username, u.name, u.phone, u.city,
              ur.role, us.status
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN user_statuses us ON us.user_id = u.id
       WHERE u.id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "المستخدم غير موجود" });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    return res.status(401).json({ error: "جلسة غير صالحة" });
  }
};

// Check specific role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "غير مصرح بالوصول" });
    }
    next();
  };
};

// Check user is approved
const requireApproved = (req, res, next) => {
  if (!req.user || !["approved", "active"].includes(req.user.status)) {
    return res.status(403).json({ error: "الحساب في انتظار الموافقة" });
  }
  next();
};

module.exports = { authenticate, requireRole, requireApproved, JWT_SECRET };
