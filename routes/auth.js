
const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const database = require("../lib/database");

// ======================================
// DATABASE HELPER FUNCTIONS
// ======================================

async function findUserByEmail(email) {
    if (database.type === "sqlite") {
        return database.db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email);
    }

    const result = await database.pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
}

async function createUser(fullName, email, mobile, passwordHash) {
    if (database.type === "sqlite") {
        return database.db
            .prepare(`
                INSERT INTO users
                (full_name, email, mobile, password_hash)
                VALUES (?, ?, ?, ?)
            `)
            .run(fullName, email, mobile, passwordHash);
    }

    const result = await database.pool.query(
        `INSERT INTO users
         (full_name, email, mobile, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [fullName, email, mobile, passwordHash]
    );

    return { lastInsertRowid: result.rows[0].id };
}

// ======================================
// 1. REGISTER / SIGN UP
// ======================================

router.post("/auth/register", async (req, res) => {
    try {
        const { fullName, email, mobile, password } = req.body;

        if (!fullName || !email || !mobile || !password) {
            return res.status(400).json({
                error: "Please fill in all the required fields."
            });
        }

        const cleanName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMobile = mobile.trim();

        if (cleanName.length < 2 || cleanName.length > 80) {
            return res.status(400).json({
                error: "Name must contain between 2 and 80 characters."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                error: "Please enter a valid email address."
            });
        }

        if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
            return res.status(400).json({
                error: "Please enter a valid 10-digit Indian mobile number."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "Password must contain at least 8 characters."
            });
        }

        const existingUser = await findUserByEmail(cleanEmail);

        if (existingUser) {
            return res.status(409).json({
                error: "An account with this email already exists."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = await createUser(
            cleanName,
            cleanEmail,
            cleanMobile,
            passwordHash
        );

        return res.status(201).json({
            message: "Account created successfully!",
            user: {
                id: result.lastInsertRowid,
                fullName: cleanName,
                email: cleanEmail,
                mobile: cleanMobile
            }
        });

    } catch (error) {
        if (
            error.code === "SQLITE_CONSTRAINT_UNIQUE" ||
            error.code === "23505"
        ) {
            return res.status(409).json({
                error: "An account with this email already exists."
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            error: "Something went wrong while creating your account."
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
                error: "Please enter your email and password."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await findUserByEmail(cleanEmail);

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        req.session.user = {
            id: user.id,
            fullName: user.full_name,
            email: user.email
        };

        return res.json({
            message: "Login successful!",
            user: req.session.user
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            error: "Something went wrong while logging in."
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
            message: "User is not logged in."
        });
    }

    return res.json({
        authenticated: true,
        user: req.session.user
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
                error: "Unable to log out."
            });
        }

        res.clearCookie("connect.sid", {
            path: "/"
        });

        return res.json({
            message: "Logged out successfully!"
        });
    });
});

// ======================================
// 5. TEMPORARY ROUTE TEST
// ======================================

router.get("/auth/test", (req, res) => {
    return res.json({
        message: "Auth routes are connected successfully!"
    });
});

module.exports = router;
