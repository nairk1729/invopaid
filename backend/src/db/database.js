const Database = require("better-sqlite3");

const db = new Database("invopaid.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS payment_links (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    service_title TEXT NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    payment_link_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    checkout_url TEXT NOT NULL,
    provider TEXT,
    provider_session_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (payment_link_id) REFERENCES payment_links(id)
  )
`).run();

module.exports = db;