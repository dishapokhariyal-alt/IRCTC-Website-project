
const path = require("path");
const fs = require("fs");

// ======================================
// LOCAL DATABASE: SQLITE
// ======================================

if (!process.env.DATABASE_URL) {
    const Database = require("better-sqlite3");

    const dataFolder = path.join(__dirname, "..", "data");

    fs.mkdirSync(dataFolder, { recursive: true });

    const dbPath = path.join(dataFolder, "users.db");

    const db = new Database(dbPath);

    db.pragma("journal_mode = WAL");

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

    console.log("SQLite database connected successfully!");

    module.exports = {
        type: "sqlite",
        db
    };

// ======================================
// HOSTED DATABASE: POSTGRESQL
// ======================================

} else {
    const { Pool } = require("pg");

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    pool.on("error", (error) => {
        console.error("Unexpected PostgreSQL error:", error);
    });

    async function initializeDatabase() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                mobile TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("PostgreSQL database connected successfully!");
    }

    module.exports = {
        type: "postgres",
        pool,
        initializeDatabase
    };
}
