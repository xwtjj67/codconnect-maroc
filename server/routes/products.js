const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole, requireApproved } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/products")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Get all approved products (public)
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.name as merchant_name
       FROM products p
       LEFT JOIN users u ON u.id = p.merchant_id
       WHERE p.approval_status = 'approved' AND p.is_active = true
       ORDER BY p.created_at DESC`
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب المنتجات" });
  }
});

// Get approved products (alias for affiliate marketplace)
router.get("/approved", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.name as merchant_name
       FROM products p
       LEFT JOIN users u ON u.id = p.merchant_id
       WHERE p.approval_status = 'approved' AND p.is_active = true
       ORDER BY p.created_at DESC`
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب المنتجات" });
  }
});

// Get merchant's products
router.get("/mine", authenticate, requireRole("product_owner"), async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM products WHERE merchant_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب المنتجات" });
  }
});

// Create product
router.post("/", authenticate, requireRole("product_owner"), async (req, res) => {
  try {
    const { name, description, cost_price, selling_price, commission, stock, category, video_url, visibility, image, images, thumbnail } = req.body;
    
    // Ensure images is a proper PostgreSQL array
    const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);
    
    const result = await db.query(
      `INSERT INTO products (merchant_id, name, description, cost_price, selling_price, commission, stock, category, video_url, visibility, image, images, thumbnail)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::text[],$13) RETURNING *`,
      [req.user.id, name, description || null, cost_price, selling_price || null, commission || null, stock || 0, category || null, video_url || null, visibility || "standard", image || null, imagesArray, thumbnail || null]
    );
    console.log("✅ Product created:", result.rows[0].id, "with", imagesArray.length, "images");
    res.status(201).json({ product: result.rows[0] });
  } catch (err) {
    console.error("❌ Create product error:", err.message);
    res.status(500).json({ error: "خطأ في إنشاء المنتج" });
  }
});

// Update product
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { name, description, cost_price, selling_price, commission, stock, category, video_url, visibility, is_active } = req.body;
    const result = await db.query(
      `UPDATE products SET name=$1, description=$2, cost_price=$3, selling_price=$4, 
       commission=$5, stock=$6, category=$7, video_url=$8, visibility=$9, is_active=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [name, description, cost_price, selling_price, commission, stock, category, video_url, visibility, is_active, req.params.id]
    );
    res.json({ product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "خطأ في تحديث المنتج" });
  }
});

// Admin: get all products
router.get("/admin/all", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.name as merchant_name
       FROM products p LEFT JOIN users u ON u.id = p.merchant_id
       ORDER BY p.created_at DESC`
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب المنتجات" });
  }
});

// Admin: approve product with pricing
router.patch("/:id/approve", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { selling_price, commission, visibility, approval_status, category } = req.body;
    await db.query(
      `UPDATE products SET approval_status = $1, selling_price = $2, commission = $3, 
       visibility = $4, category = $5, updated_at = NOW() WHERE id = $6`,
      [approval_status || "approved", selling_price, commission, visibility || "standard", category || null, req.params.id]
    );
    console.log(`✅ Product ${req.params.id} approved`);
    res.json({ message: "تم تحديث حالة المنتج" });
  } catch (err) {
    console.error("❌ Approve product error:", err.message);
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

// Admin: reject product
router.patch("/:id/reject", authenticate, requireRole("admin"), async (req, res) => {
  try {
    await db.query(
      "UPDATE products SET approval_status = 'rejected', updated_at = NOW() WHERE id = $1",
      [req.params.id]
    );
    res.json({ message: "تم رفض المنتج" });
  } catch (err) {
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

// Admin: approve/reject product (legacy)
router.patch("/:id/approval", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { approval_status } = req.body;
    await db.query(
      "UPDATE products SET approval_status = $1, updated_at = NOW() WHERE id = $2",
      [approval_status, req.params.id]
    );
    res.json({ message: "تم تحديث حالة المنتج" });
  } catch (err) {
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

// Upload product images
router.post("/:id/images", authenticate, upload.array("images", 10), async (req, res) => {
  try {
    const imagePaths = req.files.map(f => `/uploads/products/${f.filename}`);
    await db.query(
      "UPDATE products SET images = $1, image = $2, updated_at = NOW() WHERE id = $3",
      [imagePaths, imagePaths[0], req.params.id]
    );
    res.json({ images: imagePaths });
  } catch (err) {
    res.status(500).json({ error: "خطأ في رفع الصور" });
  }
});

module.exports = router;
