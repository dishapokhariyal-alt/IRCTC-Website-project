const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Find the location where our database will be stored
const dataFolder = path.join(__dirname, "..", "data");

// Create the folder if it doesn't exist
fs.mkdirSync(dataFolder, { recursive: true });

// Connect to the SQLite database
const dbPath = path.join(dataFolder, "users.db");
const db = new Database(dbPath);

// Improve database performance
db.pragma("journal_mode = WAL");

// Create the users table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        mobile TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);

console.log("Users database connected successfully!");

module.exports = db;
