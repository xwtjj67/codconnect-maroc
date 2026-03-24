const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole, requireApproved } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const mediaRootDir = path.join(__dirname, "../uploads/products");
const imageUploadDir = path.join(mediaRootDir, "images");
const videoUploadDir = path.join(mediaRootDir, "videos");

[mediaRootDir, imageUploadDir, videoUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const productMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.fieldname === "video" || file.mimetype.startsWith("video/");
    cb(null, isVideo ? videoUploadDir : imageUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.mimetype.startsWith("video/") ? ".mp4" : ".jpg");
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext.toLowerCase()}`);
  },
});

const productMediaUpload = multer({
  storage: productMediaStorage,
  limits: { fileSize: 100 * 1024 * 1024, files: 6 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images" && file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }

    if (file.fieldname === "video" && file.mimetype.startsWith("video/")) {
      return cb(null, true);
    }

    cb(new Error("نوع الملف غير مدعوم"));
  },
});

const productImageUpload = multer({
  storage: productMediaStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }

    cb(new Error("نوع الملف غير مدعوم"));
  },
});

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

// Upload product media before create
router.post(
  "/upload",
  authenticate,
  requireRole("product_owner"),
  productMediaUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const imageFiles = Array.isArray(req.files?.images) ? req.files.images : [];
      const videoFiles = Array.isArray(req.files?.video) ? req.files.video : [];

      if (imageFiles.length === 0 && videoFiles.length === 0) {
        return res.status(400).json({ error: "لم يتم اختيار ملفات للرفع" });
      }

      const imageUrls = imageFiles.map((file) => `/uploads/products/images/${file.filename}`);
      const videoUrl = videoFiles[0] ? `/uploads/products/videos/${videoFiles[0].filename}` : null;

      console.log("✅ Product media uploaded:", {
        merchantId: req.user.id,
        images: imageUrls.length,
        hasVideo: !!videoUrl,
      });

      res.json({
        images: imageUrls,
        image: imageUrls[0] || null,
        thumbnail: imageUrls[0] || null,
        video_url: videoUrl,
      });
    } catch (err) {
      console.error("❌ Product media upload error:", err.message);
      res.status(500).json({ error: "فشل رفع ملفات المنتج" });
    }
  }
);

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

    const normalizedName = typeof name === "string" ? name.trim() : "";
    const numericCostPrice = Number(cost_price);
    const numericStock = Number(stock) || 0;
    const imagesArray = Array.isArray(images)
      ? images.filter(Boolean)
      : (typeof images === "string" && images ? [images] : []);
    const primaryImage = image || thumbnail || imagesArray[0] || null;

    if (!normalizedName) {
      return res.status(400).json({ error: "اسم المنتج مطلوب" });
    }

    if (!Number.isFinite(numericCostPrice) || numericCostPrice < 0) {
      return res.status(400).json({ error: "سعر التكلفة غير صالح" });
    }

    if (!primaryImage) {
      return res.status(400).json({ error: "أضف صورة واحدة على الأقل للمنتج" });
    }

    const result = await db.query(
      `INSERT INTO products (merchant_id, name, description, cost_price, selling_price, commission, stock, category, video_url, visibility, image, images, thumbnail)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::text[],$13) RETURNING *`,
      [
        req.user.id,
        normalizedName,
        typeof description === "string" ? description.trim() || null : null,
        numericCostPrice,
        selling_price || null,
        commission || null,
        numericStock,
        category || null,
        video_url || null,
        visibility || "standard",
        primaryImage,
        imagesArray.length > 0 ? imagesArray : [primaryImage],
        thumbnail || primaryImage,
      ]
    );

    console.log("✅ Product created:", result.rows[0].id, "with", (imagesArray.length || 1), "images");
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
router.post("/:id/images", authenticate, productImageUpload.array("images", 10), async (req, res) => {
  try {
    const imagePaths = req.files.map((f) => `/uploads/products/images/${f.filename}`);
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
