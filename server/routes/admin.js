const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// Get admin stats
router.get("/stats", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const usersResult = await db.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE ur.role = 'affiliate') as affiliates,
        COUNT(*) FILTER (WHERE ur.role = 'product_owner') as merchants,
        COUNT(*) FILTER (WHERE us.status = 'pending') as pending
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN user_statuses us ON us.user_id = u.id
    `);

    const productsResult = await db.query("SELECT COUNT(*) as total FROM products");
    const ordersResult = await db.query(`
      SELECT COUNT(*) as total,
             COALESCE(SUM(selling_price), 0) as revenue,
             COALESCE(SUM(commission_amount), 0) as commissions
      FROM orders
    `);

    const u = usersResult.rows[0];
    const o = ordersResult.rows[0];

    res.json({
      stats: {
        totalUsers: parseInt(u.total),
        affiliates: parseInt(u.affiliates),
        merchants: parseInt(u.merchants),
        pendingUsers: parseInt(u.pending),
        totalProducts: parseInt(productsResult.rows[0].total),
        totalOrders: parseInt(o.total),
        totalRevenue: parseFloat(o.revenue),
        totalCommissions: parseFloat(o.commissions),
      },
    });
  } catch (err) {
    console.error("❌ Admin stats error:", err.message);
    res.status(500).json({ error: "خطأ في جلب الإحصائيات" });
  }
});

module.exports = router;
