const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// Submit service request
router.post("/", async (req, res) => {
  try {
    const { name, phone, role, service_name } = req.body;
    const result = await db.query(
      "INSERT INTO service_requests (name, phone, role, service_name) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, phone, role, service_name]
    );
    res.status(201).json({ request: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "خطأ في إرسال الطلب" });
  }
});

// Admin: get all
router.get("/admin/all", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM service_requests ORDER BY created_at DESC");
    res.json({ requests: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ في جلب الطلبات" });
  }
});

// Admin: update status
router.patch("/:id/status", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE service_requests SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ message: "تم التحديث" });
  } catch (err) {
    res.status(500).json({ error: "خطأ في التحديث" });
  }
});

module.exports = router;
