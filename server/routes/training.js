const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// Get published training (affiliate)
router.get("/", authenticate, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM training_content WHERE is_published = true ORDER BY sort_order, created_at DESC"
    );
    res.json({ content: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب المحتوى" });
  }
});

// Admin: get all training
router.get("/admin/all", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM training_content ORDER BY sort_order, created_at DESC");
    res.json({ content: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب المحتوى" });
  }
});

// Admin: create
router.post("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { title, description, content, type, category, access_level, video_url, thumbnail, is_published, sort_order, read_time } = req.body;
    const result = await db.query(
      `INSERT INTO training_content (title, description, content, type, category, access_level, video_url, thumbnail, is_published, sort_order, read_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title, description, content, type||"article", category||"عام", access_level||"standard", video_url, thumbnail, is_published||false, sort_order||0, read_time]
    );
    res.status(201).json({ content: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "خطأ في إنشاء المحتوى" });
  }
});

// Admin: update
router.put("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { title, description, content, type, category, access_level, video_url, thumbnail, is_published, sort_order, read_time } = req.body;
    const result = await db.query(
      `UPDATE training_content SET title=$1, description=$2, content=$3, type=$4, category=$5, 
       access_level=$6, video_url=$7, thumbnail=$8, is_published=$9, sort_order=$10, read_time=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [title, description, content, type, category, access_level, video_url, thumbnail, is_published, sort_order, read_time, req.params.id]
    );
    res.json({ content: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

// Admin: delete
router.delete("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM training_content WHERE id = $1", [req.params.id]);
    res.json({ message: "تم الحذف" });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الحذف" });
  }
});

// Track views
router.post("/:id/view", authenticate, async (req, res) => {
  try {
    await db.query("UPDATE training_content SET views_count = views_count + 1 WHERE id = $1", [req.params.id]);
    await db.query(
      `INSERT INTO watch_history (user_id, content_id, watch_count, last_watched_at)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (user_id, content_id) DO UPDATE SET watch_count = watch_history.watch_count + 1, last_watched_at = NOW()`,
      [req.user.id, req.params.id]
    );
    res.json({ message: "تم التسجيل" });
  } catch (err) {
    res.status(500).json({ error: "خطأ" });
  }
});

module.exports = router;
