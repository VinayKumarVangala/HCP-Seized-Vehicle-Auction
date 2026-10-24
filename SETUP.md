# SVAMS - Seized Vehicle Auction Management System

## Project Setup

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

The Vite dev server starts on port 8443 by default (configured in vite.config.ts).

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

## Environment Configuration

All secrets, API endpoints, and feature flags are configured via `.env` files.

### Quick Start

```bash
# Copy template
cp .env.example .env

# Edit with your values
# Required: VITE_API_URL, VITE_WS_URL, VITE_AUTH_COOKIE_NAME
```

### Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_URL` | Frontend URL | `http://localhost:8443` |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` |
| `VITE_WS_URL` | WebSocket server URL | `ws://localhost:3001` |
| `VITE_AUTH_COOKIE_NAME` | Session cookie name | `svams_session` |
| `VITE_CSRF_COOKIE_NAME` | CSRF cookie name | `svams_csrf` |
| `VITE_SESSION_TIMEOUT` | Session expiry (ms) | `3600000` |

### External Integrations (Placeholders)

```env
# VAHAN API (Vehicle Registration Database)
VITE_VAHAN_API_URL=https://api.vahan.gov.in
VITE_VAHAN_API_KEY=your_vahan_api_key_here
VITE_VAHAN_CLIENT_ID=your_vahan_client_id

# CCTNS (Crime and Criminal Tracking Network)
VITE_CCTNS_API_URL=https://api.cctns.gov.in
VITE_CCTNS_API_KEY=your_cctns_api_key_here
VITE_CCTNS_CLIENT_ID=your_cctns_client_id

# Payment Gateway
VITE_PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
VITE_PAYMENT_MERCHANT_ID=your_merchant_id
VITE_PAYMENT_API_KEY=your_payment_api_key
VITE_PAYMENT_WEBHOOK_SECRET=your_webhook_secret

# SMS/Email Gateway (for notices)
VITE_SMS_GATEWAY_URL=https://api.sms-provider.com
VITE_SMS_API_KEY=your_sms_api_key
VITE_SMS_SENDER_ID=SVAMS

VITE_EMAIL_API_URL=https://api.email-provider.com
VITE_EMAIL_API_KEY=your_email_api_key
VITE_EMAIL_FROM=noreply@svams.telangana.gov.in

# Document Storage (e.g., AWS S3, Azure Blob)
VITE_DOC_STORAGE_URL=https://your-bucket.s3.amazonaws.com
VITE_DOC_STORAGE_ACCESS_KEY=your_access_key
VITE_DOC_STORAGE_SECRET_KEY=your_secret_key
VITE_DOC_STORAGE_REGION=ap-south-1

# Digital Signature (e-Sign)
VITE_ESIGN_API_URL=https://api.esign.gov.in
VITE_ESIGN_API_KEY=your_esign_api_key
VITE_ESIGN_CLIENT_ID=your_esign_client_id
```

### Feature Flags

```env
VITE_ENABLE_REALTIME=true       # Enable WebSocket real-time features
VITE_ENABLE_MOCK_API=true       # Use mock store (set false for real backend)
VITE_ENABLE_WEBSOCKETS=true     # Enable WebSocket connections
VITE_MOCK_DELAY_MS=300          # Simulated network latency
```

### Security Variables

```env
VITE_LOG_LEVEL=debug            # debug | info | warn | error
VITE_SENTRY_DSN=                # Sentry error tracking DSN
VITE_ANALYTICS_ID=              # Google Analytics / Matomo ID
VITE_CSP_NONCE_ENABLED=true     # Content Security Policy nonce
VITE_HSTS_ENABLED=true          # HTTP Strict Transport Security
```

### Copy Template

```bash
cp .env.example .env
# Edit .env with your actual values
```

> **⚠️ Security**: Never commit `.env` with real secrets. Use `.env.example` as template. The `.env` file is gitignored.

---

## Project Structure

```
src/
├── main.tsx              # React entry point
├── App.tsx               # Main app component with routing + AuthProvider
├── index.css             # Global styles + Tailwind v4 import + theme tokens
├── nav.tsx               # Navigation context, types, role menus
├── contexts/
│   └── AuthContext.tsx   # Session auth, permissions, roles
├── api/
│   ├── types.ts          # 200+ TypeScript interfaces
│   ├── mockStore.ts      # In-memory database (full CRUD)
│   ├── service.ts        # API service layer (mock/real)
│   ├── websocket.ts      # WebSocket client with auto-reconnect
│   └── notifications.ts  # Cross-role real-time notifications
├── components/
│   ├── AppShell.tsx      # Layout shell (sidebar + topbar + logos)
│   └── ui.tsx            # 20+ reusable UI components
└── screens/
    ├── LoginScreen.tsx
    ├── PSDashboard.tsx
    ├── PSVehicleList.tsx
    ├── PSNewSeizure.tsx
    ├── PSVehicleDetail.tsx
    ├── PSNoticeTracking.tsx
    ├── SHOApprovalQueue.tsx
    ├── SHOReviewVehicle.tsx
    ├── AUCEligibleVehicles.tsx
    ├── AUCCreateLot.tsx
    ├── AUCLiveAuction.tsx
    ├── AUCSaleConfirmation.tsx
    ├── ADMNoticeRules.tsx
    ├── BIDDashboard.tsx
    ├── BIDBrowse.tsx
    ├── BIDLotDetail.tsx
    ├── BIDBiddingScreen.tsx
    └── PlaceholderScreens.tsx
```

---

## Available Roles & Entry Points

| Role | Dashboard | Primary Screens |
|------|-----------|-----------------|
| **PS** (Police Station) | `ps-dashboard` | Vehicle List, New Seizure, Notice Tracking |
| **SHO** | `sho-approval-queue` | Approval Queue, Review Vehicle |
| **Legal** | `legal-dashboard` | Legal clearance & court stays |
| **AuctionCell** | `auc-dashboard` | Eligible Vehicles, Create Lot, Live Auction |
| **Finance** | `fin-dashboard` | EMD, payments, reconciliation |
| **Admin** | `adm-dashboard` | Users, Notice Rules, System Config |
| **Bidder** | `bid-dashboard` | Browse Auctions, Lot Detail, Bidding |

---

## Key Features Implemented

### Core Workflow
- **Multi-role workflow** with role-based navigation
- **6-step seizure entry** (Vehicle → Seizure → Owner → Docs → Valuation → Review)
- **3-notice compliance tracker** with visual progress dots & interval validation
- **Multi-level approval chain**: PS → SHO → Legal → Auction Cell → District Admin
- **6-step Auction Lot Creation** with pricing, scheduling, terms
- **Live Auction Operator View** with real-time bid feed, timer, H1 pulse
- **Bidder Interface** with auto-bid, wallet, bid history

### Real-time Architecture
- **WebSocket Service** with auto-reconnect, heartbeat, message queue
- **Cross-role Notifications** (seizure created → SHO, bid placed → bidders)
- **Live Auction Bidding** with timer sync & auto-extend
- **Fallback Polling** when WebSocket unavailable
- **Dashboard KPIs** auto-refresh on relevant events

### API Layer
- **Type-safe**: 200+ TypeScript interfaces in `src/api/types.ts`
- **Mock Store**: Full in-memory database with realistic test data
- **Service Layer**: Swappable mock/real API in `src/api/service.ts`
- **Session Auth**: Cookie-based with CSRF, auto-refresh, role permissions

### UI/UX
- **Responsive Layout** with collapsible sidebar, dark topbar
- **Design System** with 20+ reusable components (`src/components/ui.tsx`)
- **Custom Theme**: Police green (`#145A43`), gold (`#D4A017`)
- **Telangana Police Logos** (top-left header, top-right TS logo)
- **Telugu Language Toggle** ready (EN/తె)

---

## Login Credentials (Demo)

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

## Mock Data Included

- **10 Vehicles** (2W, 4W, Commercial across Hyderabad stations)
- **5 Seizures** (Submitted, SHO Approved, Legal Review, Auction Ready, Blocked)
- **5 Notices** with delivery tracking (Registered Post, Speed Post, Newspaper)
- **2 Valuations** + 6 Documents (memo, RC, insurance, photos, FIR, valuation)
- **1 Auction Lot** (LOT-HYD-2025-0047) with 3 vehicles
- **4 Bidders** with KYC Verified, EMD paid
- **Notice Rules** for Crime Vehicle (3 notices, 15/45/90/30) & Victim Vehicle
- **Audit Logs** with timestamp, user, action, IP, severity

---

## Switching to Real Backend

### 1. Disable Mock API
```env
VITE_ENABLE_MOCK_API=false
```

### 2. Deploy WebSocket Server
- Node.js/Go/Python server at `VITE_WS_URL`
- Implement event handlers for all `WebSocketMessageType` events

### 3. Replace Mock Store Calls
In `src/api/service.ts`, replace mock calls with real `fetch`:

```typescript
// Example: replace mockStore.getVehicles with real API
async getVehicles(filters?: VehicleFilters): Promise<PaginatedResponse<Vehicle>> {
  const params = new URLSearchParams();
  Object.entries(filters || {}).forEach(([k, v]) => params.set(k, String(v)));
  const res = await fetch(`${API_BASE}/vehicles?${params}`, {
    headers: { Authorization: `Bearer ${sessionToken()}` },
    credentials: 'include',
  });
  return res.json();
}
```

### 4. Configure External Integrations
Fill in real API keys in `.env` for VAHAN, CCTNS, Payment, SMS, Email, Storage, e-Sign.

---

## Documentation

| File | Description |
|------|-------------|
| **README.md** | Complete project documentation |
| **AGENTS.md** | Project overview for AI agents |
| **CLAUDE.md** | AI agent instructions |
| **src/imports/Auction.md** | Figma design specification (687 lines) |

The `src/imports/Auction.md` contains the complete Figma prototype specification with design tokens, component library, screen specs for all 7 roles, prototype connections, and handoff notes.