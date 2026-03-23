const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// GET /api/stats/admin
router.get("/admin", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const usersResult = await db.query(`
      SELECT
        COUNT(DISTINCT u.id) as total,
        COUNT(DISTINCT u.id) FILTER (WHERE ur.role = 'affiliate') as affiliates,
        COUNT(DISTINCT u.id) FILTER (WHERE ur.role = 'product_owner') as merchants,
        COUNT(DISTINCT u.id) FILTER (WHERE us.status = 'pending') as pending
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

// GET /api/stats/affiliate
router.get("/affiliate", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const ordersResult = await db.query(`
      SELECT
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status IN ('confirmed', 'delivered')) as confirmed,
        COALESCE(SUM(commission_amount) FILTER (WHERE status IN ('confirmed', 'delivered')), 0) as earnings
      FROM orders
      WHERE affiliate_id = $1
    `, [userId]);

    const o = ordersResult.rows[0];

    res.json({
      stats: {
        earnings: parseFloat(o.earnings),
        orders: parseInt(o.total_orders),
        pending: parseInt(o.pending),
        confirmed: parseInt(o.confirmed),
      },
    });
  } catch (err) {
    console.error("❌ Affiliate stats error:", err.message);
    res.status(500).json({ error: "خطأ في جلب الإحصائيات" });
  }
});

// GET /api/stats/merchant
router.get("/merchant", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const productsResult = await db.query(
      "SELECT COUNT(*) as total FROM products WHERE merchant_id = $1",
      [userId]
    );

    const ordersResult = await db.query(`
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(selling_price - commission_amount), 0) as revenue,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)) as month_sales
      FROM orders
      WHERE merchant_id = $1
    `, [userId]);

    const o = ordersResult.rows[0];

    res.json({
      stats: {
        revenue: parseFloat(o.revenue),
        orders: parseInt(o.total_orders),
        products: parseInt(productsResult.rows[0].total),
        monthSales: parseInt(o.month_sales),
      },
    });
  } catch (err) {
    console.error("❌ Merchant stats error:", err.message);
    res.status(500).json({ error: "خطأ في جلب الإحصائيات" });
  }
});

module.exports = router;
