import Database from 'better-sqlite3';
import fs from 'node:fs'; import path from 'node:path';
const dataDir = path.resolve('data'); fs.mkdirSync(dataDir, { recursive: true });
const registryPath = path.join(dataDir, 'registry.sqlite');
export const registry = new Database(registryPath); registry.pragma('journal_mode = WAL');
registry.exec(`CREATE TABLE IF NOT EXISTS businesses (id TEXT PRIMARY KEY, name TEXT NOT NULL, db_name TEXT UNIQUE NOT NULL, active INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, business_id TEXT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('SUPER_ADMIN','OWNER','STAFF')), active INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
export function tenantDb(dbName) { const db = new Database(path.join(dataDir, dbName)); db.pragma('journal_mode = WAL'); db.exec(`CREATE TABLE IF NOT EXISTS sales (id TEXT PRIMARY KEY, amount REAL NOT NULL CHECK(amount > 0), note TEXT DEFAULT '', sold_at TEXT NOT NULL, created_by TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT, version INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS activity_logs (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, action TEXT NOT NULL, detail TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sync_events (id TEXT PRIMARY KEY, device_id TEXT, status TEXT NOT NULL, detail TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`); return db; }
export function business(id) { return registry.prepare('SELECT * FROM businesses WHERE id=?').get(id); }
