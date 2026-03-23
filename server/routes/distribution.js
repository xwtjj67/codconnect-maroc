const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// Get current distribution state
router.get("/state", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM distribution_state LIMIT 1");
    res.json({ state: result.rows[0] || { current_index: 0, total_sheets: 0 } });
  } catch (err) {
    res.status(500).json({ error: "خطأ" });
  }
});

// Distribute lead
router.post("/distribute", authenticate, async (req, res) => {
  try {
    const { user_name, user_phone, user_role } = req.body;

    // Get next index
    let stateResult = await db.query("SELECT * FROM distribution_state LIMIT 1");
    let state = stateResult.rows[0];
    
    if (!state) {
      await db.query("INSERT INTO distribution_state (current_index, total_sheets) VALUES (0, 5)");
      state = { current_index: 0, total_sheets: 5 };
    }

    const sheetIndex = state.current_index;
    const nextIndex = (sheetIndex + 1) % (state.total_sheets || 5);

    // Update index
    await db.query("UPDATE distribution_state SET current_index = $1, updated_at = NOW()", [nextIndex]);

    // Log
    await db.query(
      "INSERT INTO distribution_logs (sheet_index, user_name, user_phone, user_role) VALUES ($1,$2,$3,$4)",
      [sheetIndex, user_name, user_phone, user_role]
    );

    res.json({ sheet_index: sheetIndex, message: "تم التوزيع" });
  } catch (err) {
    res.status(500).json({ error: "خطأ في التوزيع" });
  }
});

// Get logs (admin)
router.get("/logs", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM distribution_logs ORDER BY created_at DESC LIMIT 100");
    res.json({ logs: result.rows });
  } catch (err) {
    res.status(500).json({ error: "خطأ" });
  }
});

module.exports = router;
