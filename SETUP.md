# SVAMS — Setup Instructions

**Document ID:** SVAMS-SETUP-2026-001  
**Version:** 1.0  
**Date:** November 6, 2026  
**Project:** Seized Vehicle Auction Management System (SVAMS)

---

## 1. Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 22+ | Required for Vite + React 19 |
| npm | 10+ | Package manager (pnpm also supported) |
| Git | 2.40+ | Version control |

Verify installation:

```bash
node --version   # v22.x or higher
npm --version    # 10.x or higher
```

---

## 2. Installation

### Clone / Open the project

```bash
cd "D:\PROJECTS\HCP\Police Seized Vehicle Auction"
```

### Install dependencies

```bash
npm install
```

### Environment configuration

Copy the template and fill in your values:

```bash
cp .env.example .env
# Edit .env with your actual values (API keys, URLs, etc.)
```

> **⚠️ Security**: Never commit `.env` with real secrets. Only `.env.example` is committed to version control. `.env` is gitignored.

### Required environment variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_APP_URL` | Frontend URL | `http://localhost:8443` | Yes |
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` | Yes |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:3001` | Yes |
| `VITE_AUTH_COOKIE_NAME` | Session cookie name | `svams_session` | Yes |
| `VITE_SESSION_TIMEOUT` | Session timeout (ms) | `3600000` | Yes |
| `VITE_ENABLE_MOCK_API` | Use mock API | `true` | Yes (v1) |
| `VITE_ENABLE_WEBSOCKETS` | Enable WebSocket | `true` | Yes |
| `VITE_MOCK_DELAY_MS` | Simulated latency | `300` | No |

External integration placeholders (VAHAN, CCTNS, Payment, SMS, Email, Storage, e-Sign) are in `.env.example` and are not required for v1 mock development.

---

## 3. Running the application

### Development server

```bash
npm run dev
```

The Vite dev server starts on `http://localhost:8443` (configured in `vite.config.ts`).

### Production build

```bash
# Type-check + bundle for production
npm run build

# Preview production build locally
npm run preview
```

### Code formatting

```bash
npm run format
```

> Note: The project uses `oxfmt`. Run this before committing (enforced by R-003 / V-003).

---

## 4. Demo credentials

All 7 roles have working demo credentials. Any password works in mock mode. Select the role from the dropdown on the login screen.

| Role | Employee ID | Dashboard Route |
|------|-------------|-----------------|
| PS Officer | TS-PS-0312 | `/ps-dashboard` |
| SHO | TS-SHO-0087 | `/sho-approval-queue` |
| Legal Officer | TS-LEG-0024 | `/legal-dashboard` |
| Auction Cell | TS-AUC-0011 | `/auc-dashboard` |
| Finance Officer | TS-FIN-0033 | `/fin-dashboard` |
| Admin | TS-ADM-0001 | `/adm-dashboard` |
| Bidder | TS-BID-0247 | `/bid-dashboard` |

---

## 5. Project structure

```
src/
├── main.tsx              # React entry point
├── App.tsx               # Root component, routing, AuthProvider
├── index.css             # Tailwind v4 + global styles + theme tokens
├── nav.tsx               # Navigation context, types, role menus
├── contexts/
│   └── AuthContext.tsx   # Session auth, permissions, roles
├── api/
│   ├── types.ts          # All TypeScript interfaces
│   ├── mockStore.ts      # In-memory database (full CRUD)
│   ├── service.ts        # API service layer (mock/real swappable)
│   ├── websocket.ts      # WebSocket client with reconnect/heartbeat
│   └── notifications.ts  # Cross-role real-time notification service
├── components/
│   └── AppShell.tsx      # Layout shell (sidebar + topbar + logos)
├── shared/
│   └── ui/               # Shared UI component library
│       ├── index.ts      # Barrel export
│       ├── Button.tsx
│       ├── Inputs.tsx
│       ├── DataDisplay.tsx
│       ├── FormComponents.tsx
│       └── Icons.tsx     # 40+ SVG icons
├── routes/
│   └── AppRoutes.tsx     # Role-based routing with guards
└── screens/              # All role-based screens
```

---

## 6. Production deployment checklist

- [ ] `npm run build` completes without errors
- [ ] `VITE_ENABLE_MOCK_API=false` in production `.env`
- [ ] Production `.env` configured with real API keys
- [ ] WebSocket server running and accessible
- [ ] PostgreSQL database provisioned
- [ ] Redis provisioned for session storage
- [ ] HTTPS with valid SSL certificate
- [ ] Content Security Policy headers configured
- [ ] Reverse proxy (Nginx/Apache) configured
- [ ] VAHAN/CCTNS/Payment integrations enabled
- [ ] Monitoring (Sentry, analytics) configured
- [ ] CI/CD pipeline set up

See `RULES_AND_CONSTRAINTS.md` section 8 for the full pre-deployment checklist.

---

## 7. Support

- **IT Helpdesk**: 040-2329-0000
- **Email**: it-support@telangana.gov.in
- **Project**: SVAMS v1.0 — Seized Vehicle Auction Management System
