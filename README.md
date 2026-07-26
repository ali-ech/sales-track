# Sales Tracker SaaS

Offline-first sales tracking for small businesses. It contains three independently deployable apps: Express API, responsive React PWA for owners/staff, and React super-admin panel.

## Run locally

1. Copy `.env.example` to `.env` and set a long `JWT_SECRET`.
2. Run `npm install` from this folder.
3. Run `npm run seed`, then `npm run dev`.
4. Open the PWA at `http://localhost:5173`; admin panel at `http://localhost:5174`; API at `http://localhost:4000`.

Seeded accounts are `admin@example.com` / `ChangeMe123!` and `owner@demo.test` / `ChangeMe123!`. Change them before deployment.

## Design and deployment

`registry.sqlite` is the control-plane database and stores businesses/users only. Creating a business provisions `data/business-<uuid>.sqlite`; tenant APIs use the authenticated business mapping and never accept a tenant database name from a client. SQLite is deliberate for a simple deployment; use one mounted persistent volume. For multi-instance production, swap `tenantDb()` for provisioned PostgreSQL databases without changing route behavior.

The PWA writes sales and a queue into IndexedDB immediately. It attempts sync at launch, when online, and every 30 seconds. V1 conflict handling is simple: immutable client UUIDs for creates; owner deletes are applied server-side; the server response replaces the local sales cache.

The executable schema initialization is in `server/src/db.js`; the corresponding portable SQL migrations are in `server/migrations/`. The super-admin API exposes cross-business totals and the latest sync audit events, while the UI focuses on the operating tasks of creating and activating businesses.

Build each frontend with `npm run build -w mobile-app` and `npm run build -w admin-panel`. Put the API behind TLS, set CORS to your frontend origins, keep `data/` on durable storage, and use a strong secret.
