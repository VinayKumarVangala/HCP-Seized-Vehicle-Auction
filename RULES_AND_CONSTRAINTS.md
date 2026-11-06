# SVAMS — Rules & Constraints

**Document ID:** SVAMS-RC-2026-001  
**Version:** 1.0  
**Status:** Approved  
**Date:** November 6, 2026  
**Project:** Seized Vehicle Auction Management System  
**Owner:** Telangana Police — IT Division  
**Applies To:** All developers, testers, and stakeholders working on SVAMS

---

## 1. Purpose

This document defines the mandatory rules, constraints, and standards that must be followed during the development, testing, deployment, and maintenance of the SVAMS application. These rules ensure consistency, security, maintainability, and compliance with Telangana Police department policies.

---

## 2. Development Rules

### 2.1 Code Quality

| Rule ID | Rule | Description | Enforcement |
|---------|------|-------------|-------------|
| R-001 | TypeScript Strict Mode | All TypeScript files must compile with `strict: true` in `tsconfig.json` | Build failure |
| R-002 | No `any` Type | Usage of `any` type is prohibited; use proper TypeScript interfaces from `src/api/types.ts` | Code review |
| R-003 | Code Formatting | All code must be formatted with `oxfmt` before commit | Pre-commit hook |
| R-004 | Functional Components | Only functional React components with hooks; no class components | Code review |
| R-005 | No Inline Styles | Use Tailwind CSS utility classes; inline styles only for dynamic values | Code review |
| R-006 | Type Exports | Separate type exports from value exports using `export type` | Build failure |
| R-007 | Error Boundaries | All async operations must have error handling | Code review |
| R-008 | Loading States | All async UI operations must show loading states | Code review |

### 2.2 Component Rules

| Rule ID | Rule | Description | Enforcement |
|---------|------|-------------|-------------|
| R-009 | Component Location | All shared UI components must live in `src/shared/ui/` | Build failure |
| R-010 | Screen Location | All screen components must live in `src/screens/` or `src/features/` | Code review |
| R-011 | Icon Usage | All icons must be imported from `src/shared/ui/Icons.tsx` | Build failure |
| R-012 | Button Component | Use the shared `Button` component for all actions; no raw `<button>` elements | Code review |
| R-013 | Form Fields | Use the shared `Field` wrapper for all form inputs | Code review |
| R-014 | Prop Drilling | Avoid prop drilling deeper than 3 levels; use Context or state management | Code review |

### 2.3 Styling Rules

| Rule ID | Rule | Description | Enforcement |
|---------|------|-------------|-------------|
| R-015 | Tailwind v4 | All styling must use Tailwind CSS v4 utility classes | Code review |
| R-016 | Theme Tokens | Use theme tokens (`--color-police-green`, etc.) from `src/index.css` | Code review |
| R-017 | Responsive Design | All components must be mobile-responsive (use `sm:`, `md:`, `lg:` prefixes) | Code review |
| R-018 | No Custom CSS | Custom CSS files are prohibited; use Tailwind utilities or theme tokens | Build failure |

### 2.4 API & Data Rules

| Rule ID | Rule | Description | Enforcement |
|---------|------|-------------|-------------|
| R-019 | Mock-First | All features must work with mock API first (`VITE_ENABLE_MOCK_API=true`) | Build success |
| R-020 | Service Layer | All API calls must go through `src/api/service.ts`; no direct `fetch` in components | Code review |
| R-021 | Type Safety | All API responses must match TypeScript interfaces in `src/api/types.ts` | Build failure |
| R-022 | WebSocket Fallback | All WebSocket-dependent features must have fallback polling | Code review |

---

## 3. Security Rules

### 3.1 Authentication & Authorization

| Rule ID | Rule | Description | Enforcement |
|---------|------|-------------|-------------|
| S-001 | Session Storage | Tokens must be stored in localStorage (not sessionStorage) | Security review |
| S-002 | CSRF Protection | Double-submit cookie pattern required for all state-changing operations | Security review |
| S-003 | Role-Based Access | All routes must have role guards; unauthorized access redirects to login | Build failure |
| S-004 | Session Expiry | Sessions expire after 1 hour (configurable via `VITE_SESSION_TIMEOUT`) | Security review |
| S-005 | Auto-Refresh | Sessions must auto-refresh every 5 minutes before expiry | Code review |

### 3.2 Secrets & Configuration

| Rule ID | Rule | Description | Enforcement |
|---------|------|-------------|-------------|
| S-006 | Environment Variables | All secrets and API keys must be in `.env`, never in source code | Pre-commit hook |
| S-007 | No Committed Secrets | `.env` file must be gitignored; only `.env.example` is committed | CI/CD pipeline |
| S-008 | Environment Template | `.env.example` must contain all required variable placeholders | Code review |

### 3.3 Data Security

| Rule ID | Rule | Description | Enforcement |
|---------|------|-------------|-------------|
| S-009 | HTTPS Only | Production deployment must use HTTPS | Deployment checklist |
| S-010 | CSP Headers | Content Security Policy headers must be configured | Deployment checklist |
| S-011 | Audit Logging | All user actions must be logged with timestamp, user, action, IP, severity | Security review |

---

## 4. Constraints

### 4.1 Technical Constraints

| Constraint ID | Constraint | Description | Impact |
|---------------|------------|-------------|--------|
| C-001 | React 19 | Application must use React 19; no downgrade to React 18 | High |
| C-002 | Vite 8 | Build tool must be Vite 8; no migration to Webpack | High |
| C-003 | Tailwind v4 | Styling must use Tailwind CSS v4; no Tailwind v3 config | Medium |
| C-004 | TypeScript 5.7 | TypeScript version must be 5.7 or higher | Medium |
| C-005 | Port 8443 | Development server runs on port 8443 by default | Low |
| C-006 | No Native Mobile | Web-responsive only; no native mobile applications for v1 | High |

### 4.2 Business Constraints

| Constraint ID | Constraint | Description | Impact |
|---------------|------------|-------------|--------|
| C-007 | 7 Roles | Exactly 7 roles: PS, SHO, Legal, AuctionCell, Finance, Admin, Bidder | High |
| C-008 | 3-Notice Rule | Minimum 3 notices required before vehicle can be auctioned | High |
| C-009 | Mock-First | Mock API must be fully functional before real backend integration | High |
| C-010 | Demo Credentials | All 7 roles must have working demo credentials | Medium |

### 4.3 Integration Constraints

| Constraint ID | Constraint | Description | Impact |
|---------------|------------|-------------|--------|
| C-011 | VAHAN API | Vehicle registration lookup via VAHAN API (placeholder in v1) | Medium |
| C-012 | CCTNS API | Criminal tracking via CCTNS API (placeholder in v1) | Medium |
| C-013 | Payment Gateway | EMD and sale payments via payment gateway (placeholder in v1) | Medium |
| C-014 | Document Storage | Document uploads to S3/Azure-compatible storage (placeholder in v1) | Medium |

---

## 5. Role-Based Access Control (RBAC) Rules

### 5.1 Role Hierarchy

| Role | Code | Can Approve | Can Create | Can Delete | Can View All |
|------|------|-------------|------------|------------|--------------|
| Admin | Admin | All | All | All | Yes |
| AuctionCell | AuctionCell | Auction lots | Lots, bids | Own lots | Auction-related |
| Finance | Finance | Payments | Payment records | Refunds | Financial data |
| Legal | Legal | Legal clearance | Legal documents | None | Legal cases |
| SHO | SHO | Seizures | None | None | Station seizures |
| PS | PS | None | Seizures, notices, docs | Own drafts | Station vehicles |
| Bidder | Bidder | None | Bids | Own bids | Public lots |

### 5.2 Permission Checks

| Rule ID | Rule | Description |
|---------|------|-------------|
| RBAC-001 | Route Protection | All routes must check user role before rendering |
| RBAC-002 | Menu Filtering | Navigation menu must only show authorized items per role |
| RBAC-003 | Action Buttons | Action buttons (approve, delete, publish) must check permissions |
| RBAC-004 | Data Filtering | Data queries must filter by user's station/role where applicable |

---

## 6. Real-Time Rules

### 6.1 WebSocket Rules

| Rule ID | Rule | Description |
|---------|------|-------------|
| RT-001 | Auto-Reconnect | WebSocket must auto-reconnect with exponential backoff (max 10 attempts) |
| RT-002 | Heartbeat | Ping/pong heartbeat every 30 seconds |
| RT-003 | Message Queue | Messages must be queued during reconnection and sent on reconnect |
| RT-004 | Fallback Polling | If WebSocket fails, poll API every 30 seconds for updates |
| RT-005 | Bid Propagation | Bid updates must propagate to all connected clients within 2 seconds |

### 6.2 Notification Rules

| Rule ID | Rule | Description |
|---------|------|-------------|
| NT-001 | Cross-Role | Notifications must be routed to the correct role (e.g., seizure created → SHO) |
| NT-002 | Real-Time | Notifications must be delivered via WebSocket, not polling |
| NT-003 | Persistence | Notifications must be stored in-memory for session duration |

---

## 7. Testing Rules

### 7.1 Testing Requirements

| Rule ID | Rule | Description |
|---------|------|-------------|
| T-001 | Build Success | All code changes must pass `npm run build` without errors |
| T-002 | No Console Errors | No uncaught console errors in browser |
| T-003 | Role Testing | Each role must be tested with demo credentials |
| T-004 | Responsive Testing | All screens must be tested on mobile and desktop |
| T-005 | Offline Handling | Application must handle WebSocket disconnection gracefully |

### 7.2 Test Data Rules

| Rule ID | Rule | Description |
|---------|------|-------------|
| T-006 | Mock Data | Use mock store data for development; no real PII |
| T-007 | Demo Credentials | Use provided demo credentials for role testing |
| T-008 | No Production Data | Never use production data in development |

---

## 8. Deployment Rules

### 8.1 Pre-Deployment Checklist

| Rule ID | Rule | Description |
|---------|------|-------------|
| D-001 | Build Success | `npm run build` must complete without errors |
| D-002 | Environment Variables | Production `.env` must be configured with real API keys |
| D-003 | Mock Disabled | `VITE_ENABLE_MOCK_API` must be `false` in production |
| D-004 | HTTPS | Production must use HTTPS with valid SSL certificate |
| D-005 | CSP Headers | Content Security Policy must be configured |
| D-006 | WebSocket Server | WebSocket server must be running and accessible |
| D-007 | Database | PostgreSQL database must be provisioned |
| D-008 | Redis | Redis must be provisioned for session storage |

### 8.2 Deployment Blockers

| Blocker | Description | Resolution |
|---------|-------------|------------|
| Build Failure | `npm run build` fails | Fix all TypeScript and lint errors |
| Missing Env Vars | Required `.env` variables missing | Configure all production variables |
| WebSocket Down | WebSocket server not running | Start WebSocket service before deployment |
| SSL Certificate | Invalid or missing SSL | Obtain and install valid certificate |

---

## 9. Documentation Rules

### 9.1 Required Documentation

| Rule ID | Rule | Description |
|---------|------|-------------|
| D-001 | PRD | Product Requirement Document must be maintained (`PRD.md`) |
| D-002 | Frontend Doc | Frontend documentation must be maintained (`FRONTEND_DOC.md`) |
| D-003 | Rules & Constraints | This document must be maintained (`RULES_AND_CONSTRAINTS.md`) |
| D-004 | Setup Guide | Setup instructions must be maintained (`SETUP.md`) |
| D-005 | README | Complete project documentation must be maintained (`README.md`) |
| D-006 | API Changes | All API changes must be documented in README |
| D-007 | New Components | All new UI components must be documented in FRONTEND_DOC.md |

### 9.2 Documentation Update Triggers

| Trigger | Action |
|---------|--------|
| New role added | Update PRD, FRONTEND_DOC.md, RULES_AND_CONSTRAINTS.md |
| New screen added | Update FRONTEND_DOC.md screen catalog |
| New icon added | Update FRONTEND_DOC.md icon section |
| New API endpoint | Update README.md API layer section |
| New env variable | Update SETUP.md environment section |
| New rule added | Update RULES_AND_CONSTRAINTS.md |

---

## 10. Version Control Rules

### 10.1 Commit Rules

| Rule ID | Rule | Description |
|---------|------|-------------|
| V-001 | No Secrets | Never commit `.env`, `.env.local`, or any file containing secrets |
| V-002 | Build Check | Run `npm run build` before committing |
| V-003 | Format First | Run `npm run format` before committing |
| V-004 | Commit Messages | Use conventional commit format (feat:, fix:, docs:, etc.) |
| V-005 | No Debug Code | Remove all `console.log`, `debugger`, and commented-out code |

### 10.2 Branch Rules

| Rule ID | Rule | Description |
|---------|------|-------------|
| V-006 | Main Branch | `main` branch must always be buildable |
| V-007 | Feature Branches | All new features must be on feature branches |
| V-008 | PR Review | All changes must be reviewed via pull request |

---

## 11. Compliance & Audit

### 11.1 Audit Trail Requirements

| Rule ID | Rule | Description |
|---------|------|-------------|
| A-001 | User Actions | All user actions must be logged (who, what, when, where) |
| A-002 | Data Changes | All data modifications must be logged with before/after values |
| A-003 | Login/Logout | All authentication events must be logged |
| A-004 | Export Logs | Audit logs must be exportable for compliance |

### 11.2 Data Retention

| Rule ID | Rule | Description |
|---------|------|-------------|
| A-005 | Audit Logs | Audit logs retained for minimum 2 years |
| A-006 | Bid Records | Bid records retained for minimum 5 years |
| A-007 | Notice Records | Notice records retained for minimum 3 years |

---

## 12. Violation & Escalation

### 12.1 Violation Levels

| Level | Description | Consequence |
|-------|-------------|-------------|
| Low | Minor style violation, missing comment | Code review comment |
| Medium | Missing error handling, no loading state | Must fix before merge |
| High | Security violation, missing role guard, committed secrets | Block merge + security review |
| Critical | Build failure, data loss risk, unauthorized access | Immediate fix + team notification |

### 12.2 Escalation Path

1. Developer → Tech Lead (code review)
2. Tech Lead → Product Manager (requirement conflict)
3. Product Manager → IT Head (policy exception)
4. IT Head → CISO (security exception)

---

## 13. Appendix

### 13.1 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 6, 2026 | IT Division | Initial release |

### 13.2 Related Documents

| Document | Location | Description |
|----------|----------|-------------|
| PRD.md | Project root | Product requirements |
| FRONTEND_DOC.md | Project root | Frontend technical documentation |
| SETUP.md | Project root | Installation and setup |
| README.md | Project root | Complete project overview |
| AGENTS.md | Project root | AI agent instructions |

### 13.3 Contact Information

| Role | Contact |
|------|---------|
| IT Helpdesk | 040-2329-0000 |
| Email | it-support@telangana.gov.in |
| Project | SVAMS v1.0 — Seized Vehicle Auction Management System |
