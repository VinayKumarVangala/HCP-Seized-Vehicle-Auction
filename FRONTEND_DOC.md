# SVAMS — Frontend Documentation

**Document ID:** SVAMS-FED-2026-001  
**Version:** 1.0  
**Status:** Draft  
**Date:** November 6, 2026  
**Project:** Seized Vehicle Auction Management System

---

## 1. Overview

This document describes the frontend architecture, component structure, styling system, and development practices for the SVAMS application. It serves as the technical reference for frontend developers working on this project.

---

## 2. Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React | 19 | UI library |
| Build Tool | Vite | 8 | Dev server, bundler |
| Language | TypeScript | 5.7 | Type-safe JavaScript |
| Styling | Tailwind CSS | v4 | Utility-first CSS |
| Routing | React Router DOM | 6+ | Client-side routing |
| State Management | React Context + Hooks | — | Auth state, global state |
| HTTP Client | Fetch API (native) | — | API requests |
| Real-time | WebSocket (native) | — | Live auction, notifications |
| Formatting | oxfmt | 0.2 | Code formatter |
| Package Manager | npm / pnpm | 10+ | Dependency management |

---

## 3. Project Structure

```
src/
├── main.tsx              # React entry point
├── App.tsx               # Root component, routing, AuthProvider
├── index.css             # Tailwind v4 import, global styles, theme tokens
├── nav.tsx               # Navigation context, types, role menus
│
├── contexts/
│   └── AuthContext.tsx   # Session auth, permissions, roles
│
├── api/
│   ├── types.ts          # 200+ TypeScript interfaces
│   ├── mockStore.ts      # In-memory database (full CRUD)
│   ├── service.ts        # API service layer (mock/real swappable)
│   ├── websocket.ts      # WebSocket service with reconnect/heartbeat
│   └── notifications.ts  # Cross-role real-time notification service
│
├── components/
│   └── AppShell.tsx      # Main layout (sidebar + topbar + logos)
│   └── shared/ui/
│       ├── index.ts              # Barrel export for all UI components
│       ├── Button.tsx            # Button component
│       ├── Inputs.tsx            # Input, Select, Textarea, Checkbox, RadioGroup, Field
│       ├── DataDisplay.tsx       # Badge, Card, Table, Avatar, Alert, Tabs, Tooltip, KPICard, PageHeader, EligibilityChip, NoticeTracker
│       ├── FormComponents.tsx    # Stepper, Modal, Drawer
│       └── Icons.tsx             # SVG icon components (40+ icons)
│
├── screens/
│   ├── LoginScreen.tsx           # Login with role selection
│   ├── PSDashboard.tsx           # Police Station dashboard
│   ├── PSVehicleList.tsx         # Vehicle registry with filters
│   ├── PSNewSeizure.tsx          # 6-step seizure entry wizard
│   ├── PSVehicleDetail.tsx       # Vehicle detail with 8 tabs
│   ├── PSNoticeTracking.tsx      # 3-notice compliance tracking
│   │
│   ├── SHOApprovalQueue.tsx      # SHO seizure approval queue
│   ├── SHOReviewVehicle.tsx      # SHO vehicle review
│   │
│   ├── LegalDashboard.tsx        # Legal officer dashboard
│   │
│   ├── AuctionDashboard.tsx      # Auction Cell dashboard
│   ├── AUCEligibleVehicles.tsx   # Vehicles eligible for auction
│   ├── AUCCreateLot.tsx          # 6-step auction lot creation
│   ├── AUCLiveAuction.tsx        # Live auction operator view
│   ├── AUCSaleConfirmation.tsx   # Post-auction sale confirmation
│   │
│   ├── FinDashboard.tsx          # Finance dashboard
│   │
│   ├── AdmDashboard.tsx          # Admin dashboard
│   ├── ADMNoticeRules.tsx        # Notice rule configuration
│   ├── AdminUsers.tsx            # User management
│   │
│   ├── BIDDashboard.tsx          # Bidder dashboard
│   ├── BIDBrowse.tsx             # Public auction listing
│   ├── BIDLotDetail.tsx          # Lot detail page
│   └── BIDBiddingScreen.tsx      # Bidder bidding interface
│
├── routes/
│   └── AppRoutes.tsx             # Role-based routing with guards

├── public/
│   └── assets/logos/
│       ├── hyd-city-police.png   # Hyderabad City Police logo
│       └── ts-logo.jpeg          # Telangana State logo
│
├── .env                          # Environment configuration
├── .env.example                  # Environment template
├── vite.config.ts                # Vite configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 4. Styling System

### 4.1 Tailwind CSS v4

The project uses Tailwind CSS v4 via the `@tailwindcss/vite` plugin. Configuration is done in `src/index.css`:

```css
@import 'tailwindcss';

@theme {
  --color-police-green: #145a43;
  --color-police-gold: #d4a017;
  --color-police-light: #f0fdf4;
  /* ... additional theme tokens */
}
```

### 4.2 Theme Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-police-green` | `#145a43` | Primary actions, active states |
| `--color-police-gold` | `#d4a017` | Accents, highlights |
| `--color-police-light` | `#f0fdf4` | Backgrounds, subtle states |

### 4.3 Component Styling Guidelines

- Use Tailwind utility classes directly in JSX
- Avoid inline styles except for dynamic values
- Use `className` for conditional styling with template literals
- Follow the existing component patterns in `DataDisplay.tsx`

---

## 5. UI Component Library

### 5.1 Shared UI Components (`src/shared/ui/`)

#### Button
```tsx
<Button variant="primary" size="md" loading={false} disabled={false}>
  Click me
</Button>
```
Variants: `primary`, `secondary`, `accent`, `ghost`, `danger`  
Sizes: `sm`, `md`, `lg`

#### Inputs
- **Input** — Text input with label, error, helper text, left/right icons
- **Select** — Dropdown select with options
- **Textarea** — Multi-line text input
- **Checkbox** — Checkbox with label and description
- **RadioGroup** — Radio button group
- **Field** — Form field wrapper with label, error, helper text

#### Data Display
- **Badge** — Status badge with variants (default, success, warning, danger, info, primary)
- **Card** — Card with header, footer, padding options
- **Table** — Data table with columns, sorting, pagination, empty/loading states
- **Avatar** — User avatar with initials fallback
- **Alert** — Alert box with type (success, warning, danger, info)
- **Tabs** — Tab navigation
- **Tooltip** — Hover tooltip
- **KPICard** — Key performance indicator card with value and trend
- **PageHeader** — Page header with title, subtitle, breadcrumbs, actions
- **EligibilityChip** — Status chip for eligibility (eligible, ineligible, pending, under-review)
- **NoticeTracker** — Visual progress tracker for notice stages

#### Form Components
- **Form** — Dynamic form renderer from field config
- **Stepper** — Multi-step progress indicator (horizontal/vertical)
- **Modal** — Modal dialog
- **Drawer** — Side drawer panel

#### Icons (`src/shared/ui/Icons.tsx`)
40+ SVG icon components including: SearchIcon, FilterIcon, ExportIcon, AddIcon, EditIcon, DeleteIcon, ViewIcon, ApproveIcon, RejectIcon, DownloadIcon, UploadIcon, SettingsIcon, UserIcon, MenuIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, CheckIcon, AlertIcon, BellIcon, HelpIcon, LayoutDashboard, Car, PlusCircle, FileText, CheckCircle, Package, Activity, Users, Award, LayoutGrid, Gavel, Building2, LogOut, Globe, HelpCircle, Sun, Moon, ShieldCheck, PlusIcon, Lock, Rocket, Database, CreditCard, AlertCircle, ClockIcon, TrendingUpIcon, SaveIcon, RefreshCwIcon, FileCheckIcon, XCircleIcon, ArchiveIcon, TruckIcon, CalendarIcon, MailIcon, PhoneIcon, MapPinIcon, DollarSignIcon, ReceiptIcon, ClipboardIcon, PrinterIcon

---

## 6. State Management

### 6.1 Authentication (`src/contexts/AuthContext.tsx`)

```tsx
const { user, token, login, logout, hasPermission, isAuthenticated, loading } = useAuth();
```

**Features:**
- Session-based auth with JWT-like tokens in localStorage
- CSRF token management
- Role-based permissions (`hasPermission(role, action)`)
- Auto session refresh
- Demo login helper for development

### 6.2 API Service (`src/api/service.ts`)

```tsx
const { data, loading, error } = useVehicles(filters);
const result = await apiService.createSeizure(seizureData);
```

**Features:**
- Mock/real swappable interface via `VITE_ENABLE_MOCK_API`
- In-memory mock store (`mockStore.ts`) with full CRUD
- Type-safe responses using 200+ TypeScript interfaces
- Caching with `useQuery` hooks

### 6.3 WebSocket Service (`src/api/websocket.ts`)

```tsx
wsService.connect(token);
wsService.subscribe('auction:bid_placed', (msg) => {
  // Handle real-time bid update
});
wsService.disconnect();
```

**Features:**
- Auto-reconnect with exponential backoff (max 10 attempts)
- Heartbeat every 30 seconds
- Message queue during reconnection
- Per-channel subscriptions with filters
- Fallback polling when WebSocket unavailable

### 6.4 Notification Service (`src/api/notifications.ts`)

```tsx
notificationService.notifySeizureCreated(seizureId, regNo, 'SHO');
notificationService.notifyBidPlaced(lotId, lotNumber, amount, bidderId, 'Bidder');
```

**Features:**
- Cross-role real-time alerts
- Role-specific notification routing
- In-memory notification store
- Real-time alert display

---

## 7. Routing

### 7.1 Route Structure (`src/routes/AppRoutes.tsx`)

Routes are organized by role with guards:

| Path | Component | Roles |
|------|-----------|-------|
| `/login` | LoginScreen | All (public) |
| `/ps-dashboard` | PSDashboard | PS |
| `/ps-vehicle-list` | PSVehicleList | PS |
| `/ps-new-seizure` | PSNewSeizure | PS |
| `/ps-vehicle-detail/:id` | PSVehicleDetail | PS |
| `/ps-notice-tracking` | PSNoticeTracking | PS |
| `/sho-approval-queue` | SHOApprovalQueue | SHO |
| `/sho-review-vehicle/:id` | SHOReviewVehicle | SHO |
| `/legal-dashboard` | LegalDashboard | Legal |
| `/auc-dashboard` | AuctionDashboard | AuctionCell |
| `/auc-eligible` | AUCEligibleVehicles | AuctionCell |
| `/auc-create-lot` | AUCCreateLot | AuctionCell |
| `/auc-live-auction/:id` | AUCLiveAuction | AuctionCell |
| `/auc-sale-confirmation/:id` | AUCSaleConfirmation | AuctionCell |
| `/bid-dashboard` | BIDDashboard | Bidder |
| `/bid-browse` | BIDBrowse | Bidder |
| `/bid-lot-detail/:id` | BIDLotDetail | Bidder |
| `/bid-bidding/:id` | BIDBiddingScreen | Bidder |
| `/adm-dashboard` | AdminDashboard | Admin |
| `/adm-notice-rules` | ADMNoticeRules | Admin |
| `/adm-users` | AdminUsers | Admin |

### 7.2 Route Guards
- `requireAuth` — Redirects to login if not authenticated
- `requireRole` — Redirects to unauthorized if role doesn't match
- `roleMenus` — Defines visible navigation items per role

---

## 8. Screens Reference

### 8.1 Police Station Screens

| Screen | Route | Description |
|--------|-------|-------------|
| PSDashboard | `/ps-dashboard` | KPIs, recent seizures, quick actions |
| PSVehicleList | `/ps-vehicle-list` | Filterable registry with bulk actions |
| PSNewSeizure | `/ps-new-seizure` | 6-step wizard with VAHAN/CCTNS |
| PSVehicleDetail | `/ps-vehicle-detail/:id` | 8 tabs: Overview, Notices, Docs, etc. |
| PSNoticeTracking | `/ps-notice-tracking` | 3-notice compliance table + drawer |

### 8.2 SHO Screens

| Screen | Route | Description |
|--------|-------|-------------|
| SHOApprovalQueue | `/sho-approval-queue` | Pending seizures with approve/reject |
| SHOReviewVehicle | `/sho-review-vehicle/:id` | Vehicle review before decision |

### 8.3 Legal Screens

| Screen | Route | Description |
|--------|-------|-------------|
| LegalDashboard | `/legal-dashboard` | Cases under review, court stays, claims |

### 8.4 Auction Cell Screens

| Screen | Route | Description |
|--------|-------|-------------|
| AuctionDashboard | `/auc-dashboard` | Auction overview and metrics |
| AUCEligibleVehicles | `/auc-eligible` | Vehicles cleared for auction |
| AUCCreateLot | `/auc-create-lot` | 6-step lot creation wizard |
| AUCLiveAuction | `/auc-live-auction/:id` | Real-time operator view |
| AUCSaleConfirmation | `/auc-sale-confirmation/:id` | Post-auction payment flow |

### 8.5 Finance Screens

| Screen | Route | Description |
|--------|-------|-------------|
| FinDashboard | `/fin-dashboard` | Payments, EMD, Refunds, Reconciliation |

### 8.6 Bidder Screens

| Screen | Route | Description |
|--------|-------|-------------|
| BIDDashboard | `/bid-dashboard` | Bidder overview and active lots |
| BIDBrowse | `/bid-browse` | Public auction listing |
| BIDLotDetail | `/bid-lot-detail/:id` | Vehicle specs, inspection, terms |
| BIDBiddingScreen | `/bid-bidding/:id` | Real-time bidder interface |

### 8.6 Admin Screens

| Screen | Route | Description |
|--------|-------|-------------|
| AdminDashboard | `/adm-dashboard` | System overview and metrics |
| ADMNoticeRules | `/adm-notice-rules` | Configurable compliance rules |
| AdminUsers | `/adm-users` | Officer accounts + roles |

---

## 9. Development Guidelines

### 9.1 Code Style
- TypeScript strict mode enabled
- Use `oxfmt` for formatting (`npm run format`)
- Functional components with hooks
- No class components
- Type exports separate from value exports

### 9.2 Component Structure
```tsx
interface Props {
  // Required props
  // Optional props with defaults
}

export const ComponentName = ({ prop1, prop2 = 'default' }: Props) => {
  // Hooks
  // Event handlers
  // Render
};
```

### 9.3 API Usage
```tsx
import { apiService } from '../api/service';

// Fetch data
const vehicles = await apiService.getVehicles({ search: 'TS09' });

// Create data
const seizure = await apiService.createSeizure(seizureData);

// Use hooks
const { data, loading, error } = useVehicles(filters);
```

### 9.4 Real-time Usage
```tsx
import { wsService } from '../api/websocket';
import { notificationService } from '../api/notifications';

// Connect
wsService.connect(token);

// Subscribe
wsService.subscribe('auction:bid_placed', (msg) => {
  const bid = msg.payload as Bid;
  // Update UI
});

// Notify
notificationService.notifySeizureCreated(seizureId, regNo, 'SHO');
```

### 9.5 Adding New Screens
1. Create `src/screens/NewScreen.tsx`
2. Add to `screenMap` in `src/App.tsx`
3. Add to `roleMenus` in `src/nav.tsx`
4. Import UI components from `src/components/ui.tsx`
5. Add route to `src/routes/AppRoutes.tsx`

---

## 10. Environment Configuration

### Required Variables (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_URL` | Frontend URL | `http://localhost:8443` |
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:3001` |
| `VITE_AUTH_COOKIE_NAME` | Session cookie name | `svams_session` |
| `VITE_SESSION_TIMEOUT` | Session timeout (ms) | `3600000` |
| `VITE_ENABLE_MOCK_API` | Use mock API | `true` |
| `VITE_ENABLE_WEBSOCKETS` | Enable WebSocket | `true` |
| `VITE_MOCK_DELAY_MS` | Simulated latency | `300` |

### External Integration Placeholders
- `VITE_VAHAN_API_URL`, `VITE_VAHAN_API_KEY`
- `VITE_CCTNS_API_URL`, `VITE_CCTNS_API_KEY`
- `VITE_PAYMENT_GATEWAY_URL`, `VITE_PAYMENT_MERCHANT_ID`
- `VITE_SMS_API_URL`, `VITE_SMS_API_KEY`
- `VITE_EMAIL_API_URL`, `VITE_EMAIL_API_KEY`
- `VITE_DOC_STORAGE_URL`, `VITE_DOC_STORAGE_ACCESS_KEY`
- `VITE_ESIGN_API_URL`, `VITE_ESIGN_API_KEY`

---

## 11. Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start development server on port 8443 |
| `build` | `vite build` | Build for production |
| `preview` | `vite preview` | Preview production build |
| `format` | `oxfmt` | Format code |

---

## 12. Demo Credentials

| Role | User ID | Password |
|------|---------|----------|
| PS | TS-PS-0312 | any |
| SHO | TS-SHO-0087 | any |
| Legal | TS-LEG-0024 | any |
| AuctionCell | TS-AUC-0011 | any |
| Finance | TS-FIN-0033 | any |
| Admin | TS-ADM-0001 | any |
| Bidder | TS-BID-0247 | any |

> Any password works in mock mode. Select role from dropdown on login screen.

---

## 13. Appendix

### 13.1 Icon Naming Conventions
- Components exported as `PascalCase` + `Icon` suffix (e.g., `SearchIcon`)
- Some icons have alias exports without `Icon` suffix (e.g., `Search`, `Filter`)
- All icons accept `size` and `className` props

### 13.2 Theme Colors
- Police Green: `#145a43` — Primary actions, active states
- Police Gold: `#d4a017` — Accents, highlights
- Police Light: `#f0fdf4` — Backgrounds, subtle states

### 13.3 Logos
- `public/assets/logos/hyd-city-police.png` — Hyderabad City Police (top-left)
- `public/assets/logos/ts-logo.jpeg` — Telangana State (top-right)
