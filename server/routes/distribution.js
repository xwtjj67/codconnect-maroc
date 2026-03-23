const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, requireRole } = require("../middleware/auth");

// Google Apps Script Web App URLs — 7 agent sheets
const SHEET_URLS = [
  "https://script.google.com/macros/s/AKfycbzjqW1-8Rn0kihkizekjQnht8tjZhZlzXzo94IlYv_tj1ZhENZmJV7Zg55ikc8bnX1BHQ/exec",
  "https://script.google.com/macros/s/AKfycbwccmkMCJLQz-8xlIoGp8Tzc0J973xE5DWRhC-Yg74kCEkVMml-bddWmyHv8ULuDPzU/exec",
  "https://script.google.com/macros/s/AKfycbzVQPr_LsvBzfnMZrn3do4NgCQsyh0kVf-HUeJkXcEX5oWWT2IxddifpwnXNFFADDzzwg/exec",
  "https://script.google.com/macros/s/AKfycbyxQTXmKr47_F8wXIfmH1lzS1k_Y6NFkIASUA0s7JCvhbki_hyp6qsyrsNzp-30EkLE/exec",
  "https://script.google.com/macros/s/AKfycbyV04pu35s7ot3nsa-tVog2ds3Q6WeltTDdJA3-OjUDT7eOGMnv5V2mWdHaxK7nbHL8Hg/exec",
  "https://script.google.com/macros/s/AKfycbx-40TpSpmGWfdobcsntAx0uUOYz___Z-N1rx2TG9AC3LxGfa2Yne3TuS2KyqaO7Le0/exec",
  "https://script.google.com/macros/s/AKfycbzzMKI3oRziQbyZRKB1JyOpM8qo1mYYTpJB2F6PPq7KSWs6vGTjiKyPPqAYMCRhXOGcrw/exec",
];

// Distribute lead — called after signup
router.post("/distribute", authenticate, async (req, res) => {
  try {
    const { name, phone, role, plan, date } = req.body;

    if (!name || !phone || !role) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Get or create distribution state
    let stateResult = await db.query("SELECT * FROM distribution_state LIMIT 1");
    let state = stateResult.rows[0];

    if (!state) {
      await db.query("INSERT INTO distribution_state (current_index, total_sheets) VALUES (0, $1)", [SHEET_URLS.length]);
      state = { current_index: 0, total_sheets: SHEET_URLS.length };
    }

    const sheetIndex = state.current_index;
    const nextIndex = (sheetIndex + 1) % SHEET_URLS.length;

    // Atomic update index
    await db.query("UPDATE distribution_state SET current_index = $1, total_sheets = $2, updated_at = NOW()", [nextIndex, SHEET_URLS.length]);

    // Send to Google Sheet
    let success = true;
    let errorMessage = null;
    const payload = { name, phone, role, plan: plan || "Standard (70DH)", date: date || new Date().toISOString() };

    console.log(`📤 Sending to Sheet ${sheetIndex + 1}...`);

    try {
      const sheetRes = await fetch(SHEET_URLS[sheetIndex], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(`✅ Sheet ${sheetIndex + 1} response: ${sheetRes.status}`);
    } catch (err) {
      console.error(`❌ Sheet ${sheetIndex + 1} failed:`, err.message);
      success = false;
      errorMessage = err.message;

      // Fallback: try other sheets
      for (let i = 1; i < SHEET_URLS.length; i++) {
        const fallback = (sheetIndex + i) % SHEET_URLS.length;
        try {
          await fetch(SHEET_URLS[fallback], {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          console.log(`✅ Fallback Sheet ${fallback + 1} OK`);
          success = true;
          errorMessage = null;
          break;
        } catch (e) {
          console.error(`❌ Fallback Sheet ${fallback + 1} failed`);
        }
      }
    }

    // Log distribution
    await db.query(
      "INSERT INTO distribution_logs (sheet_index, user_name, user_phone, user_role, success, error_message) VALUES ($1,$2,$3,$4,$5,$6)",
      [sheetIndex, name, phone, role, success, errorMessage]
    );

    res.json({ success, sheet_index: sheetIndex + 1, message: success ? "تم التوزيع" : "فشل التوزيع" });
  } catch (err) {
    console.error("❌ Distribution error:", err.message);
    res.status(500).json({ error: "خطأ في التوزيع" });
  }
});

// Get state (admin)
router.get("/state", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM distribution_state LIMIT 1");
    res.json({ state: result.rows[0] || { current_index: 0, total_sheets: SHEET_URLS.length } });
  } catch (err) {
    res.status(500).json({ error: "خطأ" });
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
