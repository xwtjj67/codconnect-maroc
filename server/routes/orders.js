const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// Create order
router.post("/", authenticate, requireRole("affiliate"), async (req, res) => {
  try {
    const { product_id, client_name, client_phone, city } = req.body;

    const product = await db.query("SELECT * FROM products WHERE id = $1", [product_id]);
    if (product.rows.length === 0) return res.status(404).json({ error: "المنتج غير موجود" });

    const p = product.rows[0];
    const commission = p.commission || 0;
    const platformProfit = (p.selling_price || 0) - p.cost_price - commission;

    const result = await db.query(
      `INSERT INTO orders (product_id, affiliate_id, merchant_id, client_name, client_phone, city, 
       selling_price, cost_price, commission_amount, platform_profit)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [product_id, req.user.id, p.merchant_id, client_name, client_phone, city,
       p.selling_price, p.cost_price, commission, platformProfit]
    );

    // Update product orders count
    await db.query("UPDATE products SET orders_count = orders_count + 1 WHERE id = $1", [product_id]);

    res.status(201).json({ order: result.rows[0] });
  } catch (err) {
    console.error("❌ Create order error:", err.message);
    res.status(500).json({ error: "خطأ في إنشاء الطلب" });
  }
});

// Get affiliate orders
router.get("/mine", authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*, p.name as product_name FROM orders o
       LEFT JOIN products p ON p.id = o.product_id
       WHERE o.affiliate_id = $1 ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب الطلبات" });
  }
});

// Get merchant orders
router.get("/merchant", authenticate, requireRole("product_owner"), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*, p.name as product_name FROM orders o
       LEFT JOIN products p ON p.id = o.product_id
       WHERE o.merchant_id = $1 ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب الطلبات" });
  }
});

// Admin: all orders
router.get("/admin/all", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*, p.name as product_name, 
       ua.name as affiliate_name, um.name as merchant_name
       FROM orders o
       LEFT JOIN products p ON p.id = o.product_id
       LEFT JOIN users ua ON ua.id = o.affiliate_id
       LEFT JOIN users um ON um.id = o.merchant_id
       ORDER BY o.created_at DESC`
    );
    res.json({ orders: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب الطلبات" });
  }
});

// Update order status
router.patch("/:id/status", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2",
      [status, req.params.id]
    );
    res.json({ message: "تم تحديث حالة الطلب" });
  } catch (err) {
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

module.exports = router;
