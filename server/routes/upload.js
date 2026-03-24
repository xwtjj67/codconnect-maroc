const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("../middleware/auth");

// Ensure upload directories exist
const uploadDirs = ["uploads/products/images", "uploads/products/videos"];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Image upload config
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/products/images")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

// Video upload config
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/products/videos")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype.split("/")[1]);
    if (ext || mime) return cb(null, true);
    cb(new Error("نوع الملف غير مدعوم"));
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|mov|avi|webm|mkv/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    cb(new Error("نوع الفيديو غير مدعوم"));
  },
});

// POST /api/upload — generic file upload
router.post("/", authenticate, (req, res) => {
  const folder = req.query.folder || req.body?.folder || "images";

  const upload = folder === "videos" ? videoUpload.single("file") : imageUpload.single("file");

  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Upload error:", err.message);
      return res.status(400).json({ error: err.message || "فشل الرفع" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "لم يتم اختيار ملف" });
    }

    const subDir = folder === "videos" ? "products/videos" : "products/images";
    const url = `/uploads/${subDir}/${req.file.filename}`;
    console.log(`✅ File uploaded: ${url}`);
    res.json({ url });
  });
});

// POST /api/upload/images — multiple images upload
router.post("/images", authenticate, imageUpload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "لم يتم اختيار صور" });
  }
  const urls = req.files.map(f => `/uploads/products/images/${f.filename}`);
  console.log(`✅ ${urls.length} images uploaded`);
  res.json({ urls });
});

module.exports = router;
