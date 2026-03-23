const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { JWT_SECRET } = require("../middleware/auth");

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
    const { name, email, phone, city, password, role, store_name, username: reqUsername } = req.body;
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

    // Insert user
    const userResult = await db.query(
      `INSERT INTO users (email, password_hash, username, name, phone, city, store_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [email, passwordHash, username, name, phone || null, city || null, store_name || null]
    );
    const userId = userResult.rows[0].id;
    console.log("📋 Inserted user:", userResult.rows[0].id, userResult.rows[0].email);

    // Insert role
    await db.query("INSERT INTO user_roles (user_id, role) VALUES ($1, $2)", [userId, role]);

    // Insert status (pending)
    await db.query("INSERT INTO user_statuses (user_id, status) VALUES ($1, 'pending')", [userId]);

    // Create default subscription (handle missing table gracefully)
    try {
      await db.query("INSERT INTO subscriptions (user_id, plan) VALUES ($1, 'standard')", [userId]);
    } catch (subErr) {
      console.log("⚠️ Subscriptions table missing, skipping:", subErr.message);
    }

    console.log(`✅ User created: ${username} (${role}) — status: pending`);

    // Return user info WITHOUT token (no auto-login, must go to pending)
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
              ur.role, us.status
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN user_statuses us ON us.user_id = u.id
       WHERE u.email = $1 OR u.username = $1
       LIMIT 1`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const user = result.rows[0];

    // Check status BEFORE password
    if (user.status === "pending") {
      return res.status(403).json({ error: "حسابك في انتظار التفعيل", status: "pending" });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ error: "حسابك موقوف، تواصل مع الدعم", status: "suspended" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
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
              s.plan, s.is_active as subscription_active
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
