const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// Get all users (admin)
router.get("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.username, u.name, u.phone, u.city, u.store_name, u.preferred_category, u.created_at,
              ur.role, us.status,
              s.plan, s.seller_plan, s.is_active as sub_active
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN user_statuses us ON us.user_id = u.id
       LEFT JOIN subscriptions s ON s.user_id = u.id
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
    const existing = await db.query("SELECT id FROM user_statuses WHERE user_id = $1", [req.params.id]);
    if (existing.rows.length === 0) {
      await db.query("INSERT INTO user_statuses (user_id, status) VALUES ($1, $2)", [req.params.id, status]);
    } else {
      await db.query("UPDATE user_statuses SET status = $1, updated_at = NOW() WHERE user_id = $2", [status, req.params.id]);
    }
    console.log(`✅ User ${req.params.id} status → ${status}`);
    res.json({ message: "تم تحديث الحالة" });
  } catch (err) {
    console.error("❌ Update status error:", err.message);
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

// Update user plan (admin)
router.patch("/:id/plan", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { plan, seller_plan } = req.body;
    const existing = await db.query("SELECT id FROM subscriptions WHERE user_id = $1", [req.params.id]);

    if (existing.rows.length === 0) {
      await db.query(
        "INSERT INTO subscriptions (user_id, plan, seller_plan) VALUES ($1, $2, $3)",
        [req.params.id, plan || null, seller_plan || null]
      );
    } else {
      if (plan) {
        await db.query("UPDATE subscriptions SET plan = $1 WHERE user_id = $2", [plan, req.params.id]);
      }
      if (seller_plan) {
        await db.query("UPDATE subscriptions SET seller_plan = $1 WHERE user_id = $2", [seller_plan, req.params.id]);
      }
    }
    console.log(`✅ User ${req.params.id} plan updated`);
    res.json({ message: "تم تحديث الخطة" });
  } catch (err) {
    console.error("❌ Update plan error:", err.message);
    res.status(500).json({ error: "خطأ في تحديث الخطة" });
  }
});

module.exports = router;
