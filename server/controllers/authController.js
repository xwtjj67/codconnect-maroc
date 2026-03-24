const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { JWT_SECRET } = require("../middleware/auth");

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

// Distribute to Google Sheets (called internally after signup)
async function distributeToSheet(userData) {
  try {
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

    const payload = {
      name: userData.name,
      phone: userData.phone || "",
      role: userData.role,
      plan: userData.plan || "Standard (70DH)",
      date: new Date().toISOString(),
    };

    console.log(`📤 Sending to Sheet ${sheetIndex + 1}...`);

    let success = true;
    let errorMessage = null;

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
      [sheetIndex, userData.name, userData.phone || "", userData.role, success, errorMessage]
    );

    console.log(`📊 Distribution complete: Sheet ${sheetIndex + 1}, success: ${success}`);
  } catch (err) {
    console.error("❌ Distribution error (non-blocking):", err.message);
  }
}

// Generate unique username
const generateUsername = async (name) => {
  let base = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "");
  if (!base) base = "user";

  let username = base;
  let attempt = 0;
  while (true) {
    const exists = await db.query("SELECT id FROM users WHERE username = $1", [username]);
    if (exists.rows.length === 0) return username;
    attempt++;
    username = `${base}${Math.floor(Math.random() * 99) + 1}`;
    if (attempt > 20) return `${base}${Date.now().toString(36)}`;
  }
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, city, password, role, store_name, username: reqUsername, preferred_category } = req.body;
    console.log(`📝 Signup attempt: ${email} (${role})`);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }

    // Check email — only block if user is approved/active
    const emailCheck = await db.query(
      `SELECT u.id, us.status FROM users u
       LEFT JOIN user_statuses us ON us.user_id = u.id
       WHERE u.email = $1`,
      [email]
    );
    if (emailCheck.rows.length > 0) {
      const existingStatus = emailCheck.rows[0].status;
      if (existingStatus === "approved" || existingStatus === "active") {
        return res.status(400).json({ error: "البريد الإلكتروني مستخدم بالفعل" });
      }
      // If pending — redirect to pending page
      if (existingStatus === "pending") {
        return res.status(409).json({ error: "حسابك في انتظار التفعيل", status: "pending" });
      }
    }

    // Check phone duplicate (only active/approved)
    if (phone) {
      const phoneCheck = await db.query(
        `SELECT u.id, us.status FROM users u
         LEFT JOIN user_statuses us ON us.user_id = u.id
         WHERE u.phone = $1`,
        [phone]
      );
      if (phoneCheck.rows.length > 0) {
        const s = phoneCheck.rows[0].status;
        if (s === "approved" || s === "active") {
          return res.status(400).json({ error: "رقم الهاتف مستخدم بالفعل" });
        }
        if (s === "pending") {
          return res.status(409).json({ error: "حسابك في انتظار التفعيل", status: "pending" });
        }
      }
    }

    // Generate or validate username
    let username = reqUsername;
    if (!username) {
      username = await generateUsername(name);
    } else {
      const usernameCheck = await db.query("SELECT id FROM users WHERE username = $1", [username]);
      if (usernameCheck.rows.length > 0) {
        username = await generateUsername(name);
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user with preferred_category
    const userResult = await db.query(
      `INSERT INTO users (email, password_hash, username, name, phone, city, store_name, preferred_category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [email, passwordHash, username, name, phone || null, city || null, store_name || null, preferred_category || null]
    );
    const userId = userResult.rows[0].id;
    console.log("📋 Inserted user:", userId, email);

    // Insert role
    await db.query("INSERT INTO user_roles (user_id, role) VALUES ($1, $2)", [userId, role]);

    // Insert status (pending)
    await db.query("INSERT INTO user_statuses (user_id, status) VALUES ($1, 'pending')", [userId]);

    // Create default subscription
    try {
      const planValue = role === "product_owner" ? null : "standard";
      const sellerPlanValue = role === "product_owner" ? "basic" : null;
      await db.query("INSERT INTO subscriptions (user_id, plan, seller_plan) VALUES ($1, $2, $3)", [userId, planValue, sellerPlanValue]);
    } catch (subErr) {
      console.log("⚠️ Subscriptions insert skipped:", subErr.message);
    }

    console.log(`✅ User created: ${username} (${role}) — status: pending`);

    // Send to Google Sheets (non-blocking, after DB insert)
    const sheetPlan = role === "product_owner" ? "Basic (350DH)" : "Standard (70DH)";
    distributeToSheet({ name, phone: phone || "", role, plan: sheetPlan });

    // Return user info WITHOUT token (no auto-login)
    res.status(201).json({
      message: "تم إنشاء حسابك بنجاح، في انتظار التفعيل",
      status: "pending",
      user: {
        id: userId,
        email,
        username,
        name,
        role,
        status: "pending",
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ error: "خطأ في إنشاء الحساب: " + err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log(`🔐 Login attempt: ${identifier}`);

    if (!identifier || !password) {
      return res.status(400).json({ error: "يرجى إدخال بيانات الدخول" });
    }

    const result = await db.query(
      `SELECT u.id, u.email, u.username, u.name, u.password_hash, u.phone, u.city,
              ur.role, us.status,
              s.plan, s.seller_plan
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN user_statuses us ON us.user_id = u.id
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.is_active = true
       WHERE u.email = $1 OR u.username = $1
       LIMIT 1`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const user = result.rows[0];

    // Verify password FIRST
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    // Check status AFTER password
    if (user.status === "pending") {
      return res.status(403).json({ error: "حسابك في انتظار التفعيل", status: "pending" });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ error: "حسابك موقوف، تواصل مع الدعم", status: "suspended" });
    }
    if (user.status === "rejected") {
      return res.status(403).json({ error: "تم رفض حسابك، تواصل مع الدعم", status: "rejected" });
    }

    // Only active/approved users get a token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ Login success: ${user.username} (${user.role}) status: ${user.status}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        status: user.status,
        phone: user.phone,
        city: user.city,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "خطأ في تسجيل الدخول" });
  }
};

// Get current user
exports.me = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.username, u.name, u.phone, u.city, u.store_name,
              ur.role, us.status,
              s.plan, s.seller_plan, s.is_active as subscription_active
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN user_statuses us ON us.user_id = u.id
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.is_active = true
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("❌ Get user error:", err.message);
    res.status(500).json({ error: "خطأ في جلب البيانات" });
  }
};

// Check username availability
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await db.query("SELECT id FROM users WHERE username = $1", [username]);
    res.json({ available: result.rows.length === 0 });
  } catch (err) {
    res.status(500).json({ error: "خطأ في التحقق" });
  }
};
