const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// Get all users (admin)
router.get("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.username, u.name, u.phone, u.city, u.store_name, u.created_at,
              ur.role, us.status
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN user_statuses us ON us.user_id = u.id
       ORDER BY u.created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error("❌ Get users error:", err.message);
    res.status(500).json({ error: "خطأ في جلب المستخدمين" });
  }
});

// Update user status (admin)
router.patch("/:id/status", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    await db.query(
      "UPDATE user_statuses SET status = $1, updated_at = NOW() WHERE user_id = $2",
      [status, req.params.id]
    );
    res.json({ message: "تم تحديث الحالة" });
  } catch (err) {
    console.error("❌ Update status error:", err.message);
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

module.exports = router;
