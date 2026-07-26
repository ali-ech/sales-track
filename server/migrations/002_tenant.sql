-- Run once for every newly provisioned business database.
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL CHECK(amount > 0),
  note TEXT DEFAULT '',
  sold_at TEXT NOT NULL,
  created_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE activity_logs (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, action TEXT NOT NULL, detail TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE sync_events (id TEXT PRIMARY KEY, device_id TEXT, status TEXT NOT NULL, detail TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
