# SentinelTrust AI — Enterprise AI Security, Privacy & Trust Intelligence Platform

**SentinelTrust AI** is a full-stack, decoupled enterprise guardrail platform built with **React 18 + TypeScript + Vite + Tailwind CSS**, **Node.js (v22+) + Express + TypeScript**, **PostgreSQL with Row Level Security (RLS)**, and **xAI Grok (`grok-4.7`) via `@ai-sdk/xai`**.

It inspects raw prompts, source code snippets, and enterprise document streams in real time—detecting prompt injections, secret leaks, SQLi/XSS vectors, and PII/PHI exposures while automatically generating sanitized/redacted payloads and compliance audit logs (`GDPR`, `HIPAA`, `PCI-DSS`, `OWASP-LLM-Top10`).

---

## Architecture & Directory Structure

```text
sentinel-trust-ai/
├── vercel.json
├── .gitignore
├── README.md
├── shared/
│   └── schemas.ts
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── sql/
│   │   └── schema.sql
│   └── src/
│       ├── index.ts
│       ├── app.ts
│       ├── config/
│       │   ├── db.ts
│       │   └── env.ts
│       ├── controllers/
│       │   ├── scan.controller.ts
│       │   ├── incident.controller.ts
│       │   ├── dashboard.controller.ts
│       │   ├── copilot.controller.ts
│       │   └── policy.controller.ts
│       ├── services/
│       │   ├── grok.service.ts
│       │   ├── db.service.ts
│       │   └── redaction.service.ts
│       ├── routes/
│       │   ├── api.router.ts
│       │   ├── scan.router.ts
│       │   ├── incident.router.ts
│       │   ├── copilot.router.ts
│       │   └── policy.router.ts
│       ├── middlewares/
│       │   ├── rateLimiter.ts
│       │   ├── validateRequest.ts
│       │   └── error.middleware.ts
│       └── schemas/
│           └── scan.schema.ts
└── frontend/
    ├── .env.example
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/
        │   └── client.ts
        ├── components/
        │   ├── Navbar.tsx
        │   ├── Sidebar.tsx
        │   ├── TrustGauge.tsx
        │   ├── PayloadScannerForm.tsx
        │   ├── RedactedDiffViewer.tsx
        │   ├── IncidentTable.tsx
        │   ├── StatCard.tsx
        │   ├── CopilotChatWindow.tsx
        │   └── ExportReportButton.tsx
        ├── pages/
        │   ├── LandingPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── ScannerPage.tsx
        │   ├── IncidentsPage.tsx
        │   ├── CopilotPage.tsx
        │   └── SettingsPage.tsx
        └── types/
            └── index.ts
```

---

## Quick Start

### 1. Provision PostgreSQL Schema & Row Level Security (RLS)
```bash
psql -U postgres -d sentineltrust_db -f backend/sql/schema.sql
```

### 2. Configure & Start Backend (`/api/v1`)
```bash
cd backend
cp .env.example .env
# Add your XAI_API_KEY and DATABASE_URL in backend/.env
npm install
npm run dev
```

### 3. Configure & Start Frontend (`http://localhost:5173`)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## API Reference (`/api/v1`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health status, Grok-4.7 engine check & PostgreSQL RLS status |
| `GET` | `/api/v1/dashboard/stats` | Tenant-isolated aggregate metrics, risk distribution & recent scans |
| `POST` | `/api/v1/scan` | Inspects payload via Grok-4.7, redacts PII/secrets, and persists audit log |
| `GET` | `/api/v1/incidents` | Filterable incident list (`severity`, `status`, `category`, `search`) |
| `PATCH` | `/api/v1/incidents/:id/status` | Updates incident status (`Open`, `In Review`, `Resolved`, `Ignored`) |
| `POST` | `/api/v1/copilot/chat` | Interactive Grok-4.7 Security Analyst Copilot for incident remediation |
| `GET` | `/api/v1/policies` | Fetches active workspace compliance policies |
| `POST` | `/api/v1/policies` | Creates or updates custom workspace security/privacy policies |

