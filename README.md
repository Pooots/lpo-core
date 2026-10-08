# LPO frontend (`lpo-core`)

React + Vite UI for LPO. Foundation mirrors LPay (`lpay-core`).

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000 — the home page shows frontend, backend API, and database status by polling `/api` and `/api/health` via the Vite proxy (`VITE_APP_URL` → Laravel).
