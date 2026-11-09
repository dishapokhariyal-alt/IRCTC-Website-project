const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const db = require("../lib/database");

// ======================================
// 1. REGISTER / SIGN UP
// ======================================

router.post("/auth/register", async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    // Check required fields
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        error: "Please fill in all the required fields.",
      });
    }

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    // Validate name
    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        error: "Name must contain between 2 and 80 characters.",
      });
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        error: "Please enter a valid email address.",
      });
    }

    // Validate Indian mobile number
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        error: "Please enter a valid 10-digit Indian mobile number.",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must contain at least 8 characters.",
      });
    }

    // Check whether email already exists
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(cleanEmail);

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Save user in database
    const result = db
      .prepare(
        `
            INSERT INTO users (full_name, email, mobile, password_hash)
            VALUES (?, ?, ?, ?)
        `,
      )
      .run(cleanName, cleanEmail, cleanMobile, passwordHash);

    return res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: result.lastInsertRowid,
        fullName: cleanName,
        email: cleanEmail,
        mobile: cleanMobile,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      error: "Something went wrong while creating your account.",
    });
  }
});

// ======================================
// 2. LOGIN
// ======================================

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Please enter your email and password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(cleanEmail);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // Regenerate session to prevent session fixation
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // Save user details in session
    req.session.user = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
    };

    return res.json({
      message: "Login successful!",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Something went wrong while logging in.",
    });
  }
});

// ======================================
// 3. CHECK LOGIN STATUS
// ======================================

router.get("/auth/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      authenticated: false,
      message: "User is not logged in.",
    });
  }

  return res.json({
    authenticated: true,
    user: req.session.user,
  });
});

// ======================================
// 4. LOGOUT
// ======================================

router.post("/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);

      return res.status(500).json({
        error: "Unable to log out.",
      });
    }

    res.clearCookie("connect.sid", {
      path: "/",
    });

    return res.json({
      message: "Logged out successfully!",
    });
  });
});

// ======================================
// 5. TEMPORARY ROUTE CONNECTION TEST
// ======================================

router.get("/auth/test", (req, res) => {
  return res.json({
    message: "Auth routes are connected successfully!",
  });
});

// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;
