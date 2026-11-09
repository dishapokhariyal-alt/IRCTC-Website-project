require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { ApiError } = require("./lib/errors");

const app = express();

app.disable("x-powered-by");

// Middleware
app.use(express.json());

// Websites allowed to access this API
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

// CORS configuration
app.use(
  cors({
    origin: (origin, cb) => {
      cb(null, !origin || allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);

// Check whether the session secret exists
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing from backend/.env");
}

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
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

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`IRCTC backend running on http://localhost:${PORT}`);
});
