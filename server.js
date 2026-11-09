
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");

const database = require("./lib/database");
const { ApiError } = require("./lib/errors");

const app = express();

app.disable("x-powered-by");

const isProduction = process.env.NODE_ENV === "production";

// Hosted deployment must use PostgreSQL.
if (isProduction && database.type !== "postgres") {
    throw new Error("Production requires DATABASE_URL for PostgreSQL.");
}

// Trust the hosting provider's reverse proxy.
if (isProduction) {
    app.set("trust proxy", 1);
}

// Middleware
app.use(express.json());

// Allowed frontend websites
const allowedOrigins = [
    "https://dishapokhariyal-alt.github.io",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...(process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
];

// CORS
app.use(
    cors({
        origin: (origin, callback) => {
            callback(null, !origin || allowedOrigins.includes(origin));
        },
        credentials: true,
    })
);

// Session secret
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing from backend/.env");
}

// PostgreSQL-backed sessions in production.
// Default in-memory sessions locally.
let sessionStore;

if (database.type === "postgres") {
    const PgSession = connectPgSimple(session);

    sessionStore = new PgSession({
        pool: database.pool,
        createTableIfMissing: true,
        tableName: "user_sessions",
    });
}

// Session configuration
app.use(
    session({
        store: sessionStore,
        name: "connect.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// API routes
app.use("/api", require("./routes/liveStatus"));
app.use("/api", require("./routes/availability"));
app.use("/api", require("./routes/fare"));
app.use("/api", require("./routes/trains"));
app.use("/api", require("./routes/pnr"));
app.use("/api", require("./routes/auth"));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ error: err.message });
    }

    console.error(err);

    res.status(500).json({
        error: "Something went wrong on the server",
    });
});

// Start server after database initialization
async function startServer() {
    if (database.type === "postgres") {
        await database.initializeDatabase();
    }

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`IRCTC backend running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Unable to start backend:", error);
    process.exit(1);
});
