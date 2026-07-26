# API overview

All protected endpoints require `Authorization: Bearer <JWT>`. `POST /api/auth/login` returns a token and role. Super-admin endpoints are under `/api/admin`; business endpoints automatically resolve the caller's business database from the signed token.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Sign in |
| GET/POST | `/api/admin/businesses` | List/create businesses (super admin) |
| PATCH | `/api/admin/businesses/:id` | Activate/deactivate business |
| GET | `/api/admin/status`, `/api/admin/reports`, `/api/admin/sync-logs` | System metrics, totals and recent sync audit |
| GET/POST | `/api/sales` | List/add sales |
| PUT/DELETE | `/api/sales/:id` | Owner edit/delete |
| GET | `/api/summary` | Today/month totals and weekly bars |
| GET/POST/PATCH | `/api/staff` | Owner staff management |
| POST | `/api/sync` | Upload queued changes and download current sales |
| GET | `/api/report.pdf` | Download tenant report |
