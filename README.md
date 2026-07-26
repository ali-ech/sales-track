# Sales Tracker SaaS

Offline-first sales tracking for small businesses. It contains three independently deployable apps: Vercel-compatible Express API, responsive React PWA for owners/staff, and React super-admin panel.

## Run locally

1. Copy `.env.example` to `.env`; set `JWT_SECRET`, `TENANT_URI_ENCRYPTION_KEY`, and the MongoDB URI for the private registry database.
2. Run `npm install` from this folder.
3. Run `npm run seed`, then `npm run dev`.
4. Open the PWA at `http://localhost:5173`; admin panel at `http://localhost:5174`; API at `http://localhost:4000`.

The seed creates `admin@example.com` / `ChangeMe123!`. Change it before deployment.

## Design and deployment

The registry MongoDB database stores super-admin data plus business connection mappings. Each business is created with its own MongoDB Atlas URI and database name. That URI is AES-256-GCM encrypted before it is stored in the registry. The server decrypts it only while handling authenticated requests and opens only that tenant's database; sales, staff, logs, and sync data are created in the customer's dedicated database.

The PWA writes sales and a queue into IndexedDB immediately. It attempts sync at launch, when online, and every 30 seconds. V1 conflict handling is simple: immutable client UUIDs for creates; owner deletes are applied server-side; the server response replaces the local sales cache.

The executable schema initialization is in `server/src/db.js`; the corresponding portable SQL migrations are in `server/migrations/`. The super-admin API exposes cross-business totals and the latest sync audit events, while the UI focuses on the operating tasks of creating and activating businesses.

Build each frontend with `npm run build -w mobile-app` and `npm run build -w admin-panel`.

## Vercel deployment

Create three Vercel projects from this one GitHub repository. Use `mobile-app` as the Root Directory for the owner/staff frontend, `admin-panel` for the admin frontend, and the repository root for the API (Vercel detects `api/index.js`). On the API project add `REGISTRY_MONGODB_URI`, `REGISTRY_DATABASE`, `TENANT_URI_ENCRYPTION_KEY`, and `JWT_SECRET`. On each frontend add `VITE_API_URL=https://your-api-project.vercel.app/api`. Use strong distinct secrets and never add a tenant's MongoDB URI as a Vercel environment variable; it is entered only through the protected super-admin screen.
