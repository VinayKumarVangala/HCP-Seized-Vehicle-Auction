# SVAMS — Seized Vehicle Auction Management System

> **Telangana Police** | A unified digital platform for managing seized vehicle auctions from seizure to sale.

![SVAMS Logo](./public/assets/logos/hyd-city-police.png)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Roles & Permissions](#roles--permissions)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Layer](#api-layer)
- [Real-time Features](#real-time-features)
- [Authentication](#authentication)
- [Screen Catalog](#screen-catalog)
- [External Integrations](#external-integrations)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)

---

## 🎯 Overview

**SVAMS (Seized Vehicle Auction Management System)** is a multi-role, real-time web application for Telangana Police to manage the complete lifecycle of seized vehicles — from initial seizure entry through notice compliance, legal clearance, auction lot creation, live bidding, to sale confirmation and payment reconciliation.

### Key Capabilities

- **End-to-end workflow**: Seizure → Notices → Legal → Auction → Sale
- **Multi-role access**: 7 distinct roles with tailored dashboards
- **Real-time auction**: WebSocket-powered live bidding with auto-extend timers
- **Notice compliance**: 3-notice tracking with interval validation
- **External integrations**: VAHAN, CCTNS, Payment Gateway, SMS/Email, e-Sign
- **Audit trail**: Complete activity logging for accountability

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SVAMS Frontend (React 19 + Vite)             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Auth Context│  │ API Service │  │ WS Service  │  │ Notif Svc  │  │
│  │ (Session)   │  │ (Mock/Real) │  │ (WebSocket) │  │ (Real-time)│  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬──────┘  │
│         │                │                │                │         │
│         └────────────────┼────────────────┼────────────────┘         │
│                          ▼                ▼                          │
│                 ┌─────────────────────────────────┐                 │
│                 │        Mock Store (In-Memory)   │                 │
│                 │  (Replace with Real API in Prod)│                 │
│                 └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Type Safety** | Full TypeScript with strict types in `src/api/types.ts` |
| **Separation of Concerns** | API layer, WebSocket, Auth, Notifications as independent services |
| **Mock-First Development** | `mockStore.ts` provides full backend simulation |
| **Real-time Ready** | WebSocket service with fallback polling |
| **Role-Based** | Context + Nav system enforces role permissions |
| **Config-Driven** | All secrets/endpoints in `.env` |

---

## ✨ Features

### Core Workflow Features
- **7-Step Seizure Entry Wizard** with VAHAN auto-fill & CCTNS validation
- **3-Notice Compliance Tracker** with visual progress dots & interval checks
- **Multi-role Approval Chain**: PS → SHO → Legal → Auction Cell → District Admin
- **6-Step Auction Lot Creation** with pricing, scheduling, terms
- **Live Auction Operator View** with real-time bid feed, timer, H1 pulse
- **Bidder Interface** with auto-bid, wallet, bid history

### UI/UX Features
- **Responsive Layout**: Collapsible sidebar, dark topbar, mobile-first
- **Design System**: Reusable components in `src/components/ui.tsx`
- **Custom Theme**: Police green (`#145A43`) + gold (`#D4A017`)
- **Accessibility**: Focus states, contrast, keyboard navigation
- **Telugu Support**: Language toggle (EN/తె) ready

### Data & Reporting
- **Dashboard KPIs** per role with real-time updates
- **Filterable Data Tables** with bulk actions, pagination, export
- **Audit Log** with timestamp, user, action, IP, severity
- **Rule Impact Preview** for notice configuration changes

---

## 👥 Roles & Permissions

| Role | Code | Dashboard | Primary Screens | Key Permissions |
|------|------|-----------|-----------------|-----------------|
| **Police Station** | `PS` | `ps-dashboard` | Vehicle List, New Seizure, Notice Tracking | Create seizures, record notices, upload docs |
| **SHO** | `SHO` | `sho-approval-queue` | Approval Queue, Review Vehicle | Approve/reject seizures, view compliance |
| **Legal Officer** | `Legal` | `legal-dashboard` | Case Management, Court Stays | Legal clearance, court orders, claims |
| **Auction Cell** | `AuctionCell` | `auc-dashboard` | Eligible Vehicles, Create Lot, Live Auction | Create lots, manage auctions, publish |
| **Finance** | `Finance` | `fin-dashboard` | Payments, EMD, Refunds, Reconciliation | Payment processing, revenue reports |
| **Admin** | `Admin` | `adm-dashboard` | Users, Notice Rules, Master Data, Integrations | Full system config, audit logs |
| **Bidder** | `Bidder` | `bid-dashboard` | Browse Auctions, Lot Detail, Bidding | Place bids, auto-bid, payments |

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 19 |
| **Build Tool** | Vite | 8 |
| **Language** | TypeScript | 5.7 |
| **Styling** | Tailwind CSS | v4 |
| **Fonts** | Inter + JetBrains Mono | Google Fonts |
| **Formatting** | oxfmt | 0.2 |
| **Package Manager** | npm/pnpm | 10+ |

---

## 📁 Project Structure

```
Police Seized Vehicle Auction/
├── .env                    # Development config (DO NOT COMMIT SECRETS)
├── .env.example            # Template with all required variables
├── package.json
├── vite.config.ts          # Vite + Figma Make + Tailwind v4
├── tsconfig.json
├── index.html
├── README.md               # This file
├── CLAUDE.md               # Agent instructions
├── AGENTS.md               # Project overview for AI agents
├── SETUP.md                # Setup instructions
├── public/
│   └── assets/logos/       # Hyderabad Police + TS logos
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Root component + routing + AuthProvider
│   ├── index.css           # Tailwind v4 + global styles + theme tokens
│   ├── nav.tsx             # Navigation context, types, role menus
│   ├── contexts/
│   │   └── AuthContext.tsx # Session auth, permissions, roles
│   ├── api/
│   │   ├── types.ts        # All TypeScript interfaces
│   │   ├── mockStore.ts    # In-memory database (full CRUD)
│   │   ├── service.ts      # API service layer (mock/real)
│   │   ├── websocket.ts    # WebSocket client with auto-reconnect
│   │   └── notifications.ts # Cross-role real-time notifications
│   ├── components/
│   │   ├── AppShell.tsx    # Layout shell (sidebar + topbar + logos)
│   │   └── ui.tsx          # 20+ reusable UI components
│   └── screens/            # 17 screen components
│       ├── LoginScreen.tsx
│       ├── PSDashboard.tsx
│       ├── PSVehicleList.tsx
│       ├── PSNewSeizure.tsx
│       ├── PSVehicleDetail.tsx
│       ├── PSNoticeTracking.tsx
│       ├── SHOApprovalQueue.tsx
│       ├── SHOReviewVehicle.tsx
│       ├── AUCEligibleVehicles.tsx
│       ├── AUCCreateLot.tsx
│       ├── AUCLiveAuction.tsx
│       ├── AUCSaleConfirmation.tsx
│       ├── ADMNoticeRules.tsx
│       ├── BIDDashboard.tsx
│       ├── BIDBrowse.tsx
│       ├── BIDLotDetail.tsx
│       ├── BIDBiddingScreen.tsx
│       └── PlaceholderScreens.tsx
└── node_modules/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- npm 10+ (or pnpm)

### Installation

```bash
# Navigate to project directory
cd "D:\PROJECTS\Ganesh HCP\Police Seized Vehicle Auction"

# Install dependencies
npm install
```

### Development Server

```bash
# Start development server (runs on http://localhost:8443)
npm run dev
```

The Vite dev server starts on port 8443 by default (configured in `vite.config.ts`).

### Build for Production

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

### Code Formatting

```bash
# Format code with oxfmt
npm run format
```

---

## ⚙️ Environment Configuration

All secrets and API endpoints are configured via `.env` files.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_URL` | Frontend URL | `http://localhost:8443` |
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:3001` |
| `VITE_AUTH_COOKIE_NAME` | Session cookie name | `svams_session` |
| `VITE_SESSION_TIMEOUT` | Session timeout (ms) | `3600000` |

### External Integrations (Placeholders)

```env
# VAHAN API (Vehicle Registration)
VITE_VAHAN_API_URL=https://api.vahan.gov.in
VITE_VAHAN_API_KEY=your_vahan_api_key_here
VITE_VAHAN_CLIENT_ID=your_vahan_client_id

# CCTNS (Crime Tracking)
VITE_CCTNS_API_URL=https://api.cctns.gov.in
VITE_CCTNS_API_KEY=your_cctns_api_key_here

# Payment Gateway
VITE_PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
VITE_PAYMENT_MERCHANT_ID=your_merchant_id
VITE_PAYMENT_API_KEY=your_payment_api_key
VITE_PAYMENT_WEBHOOK_SECRET=your_webhook_secret

# SMS/Email Gateway
VITE_SMS_API_URL=https://api.sms-provider.com
VITE_SMS_API_KEY=your_sms_api_key
VITE_EMAIL_API_URL=https://api.email-provider.com
VITE_EMAIL_API_KEY=your_email_api_key

# Document Storage (S3/Azure)
VITE_DOC_STORAGE_URL=https://your-bucket.s3.amazonaws.com
VITE_DOC_STORAGE_ACCESS_KEY=your_access_key
VITE_DOC_STORAGE_SECRET_KEY=your_secret_key

# Digital Signature
VITE_ESIGN_API_URL=https://api.esign.gov.in
VITE_ESIGN_API_KEY=your_esign_api_key
```

### Feature Flags

```env
VITE_ENABLE_REALTIME=true
VITE_ENABLE_MOCK_API=true
VITE_ENABLE_WEBSOCKETS=true
VITE_MOCK_DELAY_MS=300
```

### Copy Template

```bash
cp .env.example .env
# Edit .env with your actual values
```

> **⚠️ Security**: Never commit `.env` with real secrets. Use `.env.example` as template.

---

## 🔌 API Layer

### Core Files

| File | Purpose |
|------|---------|
| `src/api/types.ts` | 200+ TypeScript interfaces |
| `src/api/mockStore.ts` | In-memory database with full CRUD |
| `src/api/service.ts` | API service (swappable mock/real) |
| `src/api/websocket.ts` | WebSocket client |
| `src/api/notifications.ts` | Real-time notification system |

### Mock Store Data

The mock store includes realistic test data:
- **10 Vehicles** (2W, 4W, Commercial)
- **5 Seizures** across different statuses
- **5 Notices** with delivery tracking
- **2 Valuations** + 6 Documents
- **1 Auction Lot** with 3 vehicles
- **4 Bidders** with KYC/EMD status
- **Notice Rules** for Crime & Victim vehicles
- **Audit Logs** with IP tracking

### Switching to Real Backend

Replace `mockStore.ts` methods with `fetch` calls in `service.ts`:

```typescript
// In service.ts - replace mock calls with real API
async getVehicles(filters?: VehicleFilters): Promise<PaginatedResponse<Vehicle>> {
  const res = await fetch(`${API_BASE}/vehicles?${new URLSearchParams(filters)}`);
  return res.json();
}
```

---

## ⚡ Real-time Features

### WebSocket Service (`src/api/websocket.ts`)

| Feature | Implementation |
|---------|----------------|
| **Auto-reconnect** | Exponential backoff (max 10 attempts) |
| **Heartbeat** | 30s ping/pong |
| **Message Queue** | Buffers messages during reconnect |
| **Subscriptions** | Per-channel with filters |
| **Fallback** | Polling if WebSocket unavailable |

### Event Types

```typescript
type WebSocketMessageType =
  | 'auction:bid_placed'      // New bid in live auction
  | 'auction:timer_update'    // Timer sync
  | 'auction:pause'           // Auction paused
  | 'auction:resume'          // Auction resumed
  | 'auction:close'           // Lot closed
  | 'seizure:created'         // New seizure submitted
  | 'seizure:approved'        // SHO approved
  | 'notice:recorded'         // Notice saved
  | 'notice:returned'         // Notice undelivered
  | 'notification:new'        // Cross-role alert
  | 'auth:session_expired'    // Force logout
```

### Notification Service

Cross-role real-time alerts:
- PS creates seizure → SHO notified
- SHO approves → PS notified
- Bid placed → All bidders notified
- Notice returned → PS alerted

```typescript
// Usage in components
notificationService.notifySeizureCreated(seizureId, regNo, 'SHO');
notificationService.notifyBidPlaced(lotId, lotNumber, amount, bidderId, 'Bidder');
```

---

## 🔐 Authentication

### Session-Based Auth (`src/contexts/AuthContext.tsx`)

| Feature | Details |
|---------|---------|
| **Storage** | localStorage (token + CSRF + expiry) |
| **Token Format** | `svams_<timestamp>_<random>` |
| **CSRF** | Double-submit cookie pattern |
| **Expiry** | 1 hour (configurable) |
| **Refresh** | Auto-refresh every 5 minutes |
| **Roles** | 7 roles with granular permissions |

### Demo Credentials

| Role | User ID | Password |
|------|---------|----------|
| PS Officer | TS-PS-0312 | any |
| SHO | TS-SHO-0087 | any |
| Legal | TS-LEG-0024 | any |
| Auction Cell | TS-AUC-0011 | any |
| Finance | TS-FIN-0033 | any |
| Admin | TS-ADM-0001 | any |
| Bidder | TS-BID-0247 | any |

> Any password works in mock mode. Select role from dropdown.

---

## 📱 Screen Catalog

### Police Station (PS)
| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `ps-dashboard` | KPIs, recent seizures, quick actions |
| Vehicle List | `ps-vehicle-list` | Filterable registry with bulk actions |
| New Seizure | `ps-new-seizure` | 6-step wizard with VAHAN/CCTNS |
| Vehicle Detail | `ps-vehicle-detail` | 8 tabs: Overview, Notices, Docs, etc. |
| Notice Tracking | `ps-notice-tracking` | 3-notice compliance table + drawer |

### SHO
| Screen | Route | Description |
|--------|-------|-------------|
| Approval Queue | `sho-approval-queue` | Pending seizures with approve/reject |

### Auction Cell
| Screen | Route | Description |
|--------|-------|-------------|
| Eligible Vehicles | `auc-eligible` | Vehicles cleared for auction |
| Create Lot | `auc-create-lot` | 6-step lot wizard |
| Live Auction | `auc-live-auction` | Real-time operator view |
| Sale Confirmation | `auc-sale-confirmation` | Post-auction payment flow |

### Bidder
| Screen | Route | Description |
|--------|-------|-------------|
| Browse Auctions | `bid-browse` | Public auction listing |
| Lot Detail | `bid-lot-detail` | Vehicle specs, inspection, terms |
| Bidding | `bid-bidding` | Real-time bidder interface |

### Admin
| Screen | Route | Description |
|--------|-------|-------------|
| Notice Rules | `adm-notice-rules` | Configurable compliance rules |
| User Management | `adm-users` | Officer accounts + roles |

---

## 🔗 External Integrations

### VAHAN API (Vehicle Registration)
- **Endpoint**: `VITE_VAHAN_API_URL`
- **Features**: Owner lookup, RC status, insurance, fitness, hypothecation
- **Used In**: PS New Seizure Step 1 & 3

### CCTNS (Crime & Criminal Tracking)
- **Endpoint**: `VITE_CCTNS_API_URL`
- **Features**: FIR status, court stay check, stolen vehicle check
- **Used In**: PS New Seizure Step 2

### Payment Gateway
- **Endpoint**: `VITE_PAYMENT_GATEWAY_URL`
- **Features**: EMD collection, sale payments, refunds, webhooks
- **Used In**: Bidder wallet, Finance reconciliation

### SMS/Email Gateway
- **Endpoints**: `VITE_SMS_API_URL`, `VITE_EMAIL_API_URL`
- **Features**: Notice delivery, auction alerts, OTP
- **Used In**: Notice tracking, Bidder notifications

### Document Storage
- **Endpoint**: `VITE_DOC_STORAGE_URL` (S3/Azure)
- **Features**: Upload/download, presigned URLs, versioning
- **Used In**: All document uploads (seizure memo, photos, valuation)

### e-Sign (Digital Signature)
- **Endpoint**: `VITE_ESIGN_API_URL`
- **Features**: Aadhaar eSign, DSC, approval signatures
- **Used In**: SHO approval, Sale certificate, Legal clearance

---

## 🧪 Development

### Adding New Screens

1. Create `src/screens/NewScreen.tsx`
2. Add to `screenMap` in `src/App.tsx`
3. Add to `roleMenus` in `src/nav.tsx`
4. Import UI components from `src/components/ui.tsx`

### Using API Service

```typescript
import { apiService } from '../api/service';

// In component
const vehicles = await apiService.getVehicles({ search: 'TS09' });
const seizure = await apiService.createSeizure(seizureData);
```

### Subscribing to Real-time Events

```typescript
import { wsService } from '../api/websocket';

// In useEffect
wsService.connect(token);
wsService.subscribe('auction:bid_placed', (msg) => {
  const bid = msg.payload as Bid;
  // Update UI
});
```

### Dispatching Notifications

```typescript
import { notificationService } from '../api/notifications';

notificationService.notifySeizureCreated(seizureId, regNo, 'SHO');
notificationService.notifyLotPublished(lotNumber, title, 'Bidder');
```

---

## 🚀 Deployment

### Build Output

```
dist/
├── index.html
├── robots.txt
└── assets/
    ├── index-<hash>.js
    └── index-<hash>.css
```

### Production Checklist

- [ ] Set `VITE_ENABLE_MOCK_API=false`
- [ ] Configure real `.env` with production API keys
- [ ] Deploy WebSocket server (Node.js/Go/Python)
- [ ] Set up HTTPS, CSP headers, HSTS
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set up database (PostgreSQL) + Redis (sessions)
- [ ] Enable VAHAN/CCTNS/Payment integrations
- [ ] Configure monitoring (Sentry, analytics)
- [ ] Set up CI/CD pipeline

### Docker Example

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 8443
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8443"]
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **README.md** | This file - complete project documentation |
| **CLAUDE.md** | AI agent instructions (references AGENTS.md) |
| **AGENTS.md** | Project overview for AI agents (original scaffold) |
| **SETUP.md** | Installation & setup instructions |
| **src/imports/Auction.md** | **Complete Figma design specification** (687 lines) |

### Auction.md — Figma Design Spec

The `src/imports/Auction.md` contains the **complete high-fidelity prototype specification** for building the SVAMS UI in Figma, including:

- **15-page Figma structure** with exact naming conventions
- **Design tokens** (colors, typography, spacing, shadows, sizing)
- **Component library** (atoms, molecules, role shells)
- **Screen-by-screen specs** for all 7 roles (50+ screens)
- **Prototype connections** with exact interaction table
- **Micro-interactions** & accessibility requirements
- **Content guidelines** (Telangana data, currency, dates)
- **Handoff checklist** for design-to-dev

> This document was the source of truth for the implemented UI.

---

## 📄 License

Telangana Police — Internal Government System

---

## 🤝 Contributing

1. Follow the existing code style (oxfmt)
2. Maintain TypeScript strict mode
3. Add types to `src/api/types.ts` for new entities
4. Update mock store if adding new data
5. Document API changes in this README

---

## 📞 Support

- **IT Helpdesk**: 040-2329-0000
- **Email**: it-support@telangana.gov.in
- **Project**: SVAMS v1.0 — Seized Vehicle Auction Management System

---

*Last updated: October 2026*
*Built with React 19 + Vite 8 + Tailwind CSS v4*