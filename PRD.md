# SVAMS — Product Requirement Document (PRD)

**Document ID:** SVAMS-PRD-2026-001  
**Version:** 1.0  
**Status:** Approved  
**Date:** November 6, 2026  
**Product:** Seized Vehicle Auction Management System (SVAMS)  
**Owner:** Telangana Police — IT Division  
**Product Manager:** [Assigned]

---

## 1. Executive Summary

### 1.1 Vision
SVAMS is a multi-role, real-time web application that digitizes the complete lifecycle of seized vehicle management for Telangana Police — from initial seizure entry through notice compliance, legal clearance, auction lot creation, live bidding, to sale confirmation and payment reconciliation. The system replaces manual paper-based processes with a secure, auditable, and transparent digital platform.

### 1.2 Problem Statement
Currently, seized vehicle management across Hyderabad district police stations relies on fragmented paper records, manual bidding events, and disjointed communication between Police Stations (PS), Station House Officers (SHO), Legal Officers, Auction Cell, Finance, Admin, and Bidders. This results in:
- Delayed seizure processing and notice compliance
- No real-time visibility into auction status for bidders
- Manual bid recording prone to errors and disputes
- Lack of audit trail for accountability
- Inefficient communication across roles

### 1.3 Goals & Objectives
| # | Objective | Success Metric |
|---|-----------|----------------|
| 1 | Digitize end-to-end seized vehicle lifecycle | 100% of seizures recorded digitally |
| 2 | Enable real-time live auction bidding | <2 second bid propagation latency |
| 3 | Ensure 3-notice compliance tracking | 0 missed notice deadlines |
| 4 | Role-based access control with audit logging | Zero unauthorized access incidents |
| 5 | Cross-role real-time notifications | Instant notification delivery (<5 seconds) |
| 6 | Mock-to-real backend swappable architecture | Backend migration <1 week effort |

### 1.4 Non-Goals
- Physical vehicle inspection scheduling (out of scope for v1)
- Integration with state-level e-courts (planned for v2)
- Mobile native applications (web-responsive only)
- Cryptocurrency payments

---

## 2. User Personas

### 2.1 PS Officer (Police Station)
- **Role Code:** `PS`
- **Responsibilities:** Record new seizures, upload seizure documents, track 3-notice compliance, submit seizures for SHO approval
- **Primary Screens:** PS Dashboard, PS Vehicle List, PS New Seizure, PS Vehicle Detail, PS Notice Tracking

### 2.2 SHO (Station House Officer)
- **Role Code:** `SHO`
- **Responsibilities:** Review and approve/reject seizures submitted by PS officers, manage approval queue
- **Primary Screens:** SHO Dashboard, SHO Approval Queue, SHO Review Vehicle

### 2.3 Legal Officer
- **Role Code:** `Legal`
- **Responsibilities:** Legal clearance, court stay management, claims resolution, legal documentation review
- **Primary Screens:** Legal Dashboard

### 2.4 Auction Cell Officer
- **Role Code:** `AuctionCell`
- **Responsibilities:** Identify eligible vehicles for auction, create auction lots, conduct live auctions, manage sale confirmation
- **Primary Screens:** Auction Dashboard, AUC Eligible Vehicles, AUC Create Lot, AUC Live Auction, AUC Sale Confirmation

### 2.5 Finance Officer
- **Role Code:** `Finance`
- **Responsibilities:** EMD collection, sale payment processing, refunds, financial reconciliation, revenue reporting
- **Primary Screens:** Finance Dashboard

### 2.6 Admin
- **Role Code:** `Admin`
- **Responsibilities:** User account management, role assignment, notice rule configuration, master data management, audit log review, integration configuration
- **Primary Screens:** Admin Dashboard, ADM Notice Rules, ADM Users

### 2.7 Bidder
- **Role Code:** `Bidder`
- **Responsibilities:** Browse auction lots, register for auctions, place bids, manage wallet/EMD, view bid history
- **Primary Screens:** Bidder Dashboard, Bidder Browse, Bidder Lot Detail, Bidder Bidding Screen

---

## 3. Functional Requirements

### 3.1 Authentication & Session Management

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| AUTH-01 | Session/cookie-based authentication | P0 | User logs in with role selection; JWT-like token stored in localStorage; session expiry after 1 hour |
| AUTH-02 | Role-based access control | P0 | Each role sees only authorized screens; unauthorized access redirects to login |
| AUTH-03 | Demo credentials | P0 | All 7 roles have demo credentials; any password works in mock mode |
| AUTH-04 | CSRF protection | P1 | Double-submit cookie pattern implemented |
| AUTH-05 | Auto-refresh session | P1 | Session refreshes every 5 minutes before expiry |

### 3.2 Police Station (PS) Workflow

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| PS-01 | View dashboard with KPIs | P0 | Shows total seizures, pending notices, approved vehicles, alerts |
| PS-02 | Vehicle list with filtering | P0 | Search by registration number, vehicle type, status; bulk actions |
| PS-03 | Create new seizure (6-step wizard) | P0 | Vehicle details → Seizure details → Owner details → Documents → Valuation → Review → Submit |
| PS-04 | VAHAN auto-fill integration | P1 | Enter registration number to fetch vehicle details from VAHAN API |
| PS-05 | CCTNS validation | P1 | Check FIR status, court stays, stolen vehicle status |
| PS-06 | Document upload | P0 | Upload seizure memo, RC, insurance, photos, FIR, valuation documents |
| PS-07 | Notice tracking | P0 | Track 3 notices (Registered Post, Speed Post, Newspaper) with delivery status |
| PS-08 | Submit for SHO approval | P0 | Submit seizure to SHO approval queue; status changes to "Pending Approval" |

### 3.3 SHO Workflow

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| SHO-01 | View approval queue | P0 | List all seizures pending SHO approval with details |
| SHO-02 | Approve/reject seizure | P0 | Approve or reject with reason; status updates accordingly |
| SHO-03 | Review vehicle details | P0 | View full seizure details before approval decision |

### 3.4 Legal Officer Workflow

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| LEG-01 | View legal dashboard | P0 | Shows cases under legal review, court stays, claims |
| LEG-02 | Legal clearance | P1 | Grant legal clearance for auction-eligible vehicles |
| LEG-03 | Court stay management | P1 | Record and track court stays affecting vehicle auction |

### 3.5 Auction Cell Workflow

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| AUC-01 | View eligible vehicles | P0 | List vehicles cleared for auction (legal + SHO approved) |
| AUC-02 | Create auction lot (6-step wizard) | P0 | Lot details → Vehicle selection → Pricing → Scheduling → Terms → Review |
| AUC-03 | Set reserve price | P0 | Minimum bid amount for each lot |
| AUC-04 | Conduct live auction | P0 | Real-time bidding interface with timer, current H1 bid, bid feed |
| AUC-05 | Auto-extend timer | P0 | Timer extends by 10 minutes if bid placed in last 10 minutes |
| AUC-06 | Close & finalize lot | P0 | Declare winner, move to sale confirmation |

### 3.6 Bidder Workflow

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| BID-01 | Browse auction lots | P0 | View all active/live auction lots with vehicle details |
| BID-02 | Register for auction | P0 | KYC verification, EMD payment, bidder number assignment |
| BID-03 | Place bid | P0 | Place bid higher than current H1; receive confirmation |
| BID-04 | Auto-bid | P1 | Set maximum bid; system auto-bids on behalf |
| BID-05 | Wallet & EMD management | P0 | View EMD status, wallet balance, payment history |
| BID-06 | Bid history | P0 | View all bids placed with timestamps and amounts |

### 3.7 Finance Workflow

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FIN-01 | View finance dashboard | P0 | Shows total revenue, pending payments, EMD collected |
| FIN-02 | Process EMD payments | P0 | Record EMD payments from bidders |
| FIN-03 | Process sale payments | P0 | Record winning bidder payments |
| FIN-04 | Process refunds | P0 | Refund EMD to non-winning bidders |
| FIN-05 | Reconciliation | P1 | Match payments with auction lots |

### 3.8 Admin Workflow

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| ADM-01 | Manage users | P0 | Create, edit, deactivate officer accounts; assign roles |
| ADM-02 | Configure notice rules | P0 | Set notice intervals, delivery methods, escalation rules |
| ADM-03 | Master data management | P1 | Manage vehicle types, police stations, auction locations |
| ADM-04 | Audit log review | P0 | View all system activities with timestamp, user, action, IP, severity |
| ADM-05 | Integration configuration | P1 | Configure VAHAN, CCTNS, Payment, SMS, Email, Storage, e-Sign endpoints |

### 3.9 Real-Time Features

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| RT-01 | WebSocket connection | P0 | Auto-reconnect with exponential backoff; heartbeat every 30 seconds |
| RT-02 | Live auction bidding | P0 | Bid placed by one bidder instantly visible to all connected bidders |
| RT-03 | Cross-role notifications | P0 | Role-specific alerts (e.g., seizure created → SHO notified) |
| RT-04 | Dashboard KPI auto-refresh | P0 | Dashboard metrics update in real-time on relevant events |
| RT-05 | Fallback polling | P1 | If WebSocket unavailable, poll API every 30 seconds |

### 3.10 External Integrations

| ID | Integration | Purpose | Priority |
|----|-------------|---------|----------|
| EXT-01 | VAHAN API | Vehicle registration lookup, RC status, insurance, fitness | P1 |
| EXT-02 | CCTNS | FIR status, court stay check, stolen vehicle check | P1 |
| EXT-03 | Payment Gateway | EMD collection, sale payments, refunds, webhooks | P1 |
| EXT-04 | SMS Gateway | Notice delivery, auction alerts, OTP | P1 |
| EXT-05 | Email Gateway | Notice delivery, auction alerts | P1 |
| EXT-06 | Document Storage (S3/Azure) | Upload/download seizure documents | P1 |
| EXT-07 | e-Sign | Digital signatures for approvals, certificates | P1 |

---

## 4. Non-Functional Requirements

### 4.1 Performance
| Metric | Target |
|--------|--------|
| Page load time | <3 seconds |
| Bid propagation latency | <2 seconds |
| WebSocket reconnection | <10 seconds |
| Concurrent users | 100+ |
| API response time | <500ms (95th percentile) |

### 4.2 Security
- All secrets in `.env` (never committed to git)
- Session-based auth with JWT-like tokens in localStorage
- CSRF protection via double-submit cookie
- Role-based permissions enforced on frontend and (future) backend
- Audit logging for all actions
- HTTPS in production
- Content Security Policy headers

### 4.3 Reliability
- WebSocket auto-reconnect with exponential backoff (max 10 attempts)
- Fallback polling when WebSocket unavailable
- Message queue during reconnection
- Mock API for development without backend

### 4.4 Scalability
- Mock data store swappable for real backend
- Component-based architecture for easy extension
- Configurable environment variables

### 4.5 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Focus states and contrast ratios
- Screen reader compatibility

### 4.6 Maintainability
- TypeScript strict mode
- 200+ TypeScript interfaces for type safety
- Component library for reusability
- Comprehensive documentation (README, SETUP, PRD)

---

## 5. User Stories

### 5.1 As a PS Officer
"I want to record a new seizure with all documents so that it enters the system for legal review and eventual auction."

### 5.2 As a SHO
"I want to review and approve seizures from my station so that only legally compliant vehicles proceed to auction."

### 5.3 As a Legal Officer
"I want to grant legal clearance for vehicles so that they can be included in auction lots."

### 5.4 As an Auction Cell Officer
"I want to create auction lots and conduct live bidding so that seized vehicles are sold transparently."

### 5.5 As a Bidder
"I want to browse auction lots and place bids in real-time so that I can purchase seized vehicles."

### 5.6 As a Finance Officer
"I want to collect EMD and process sale payments so that revenue is properly accounted for."

### 5.7 As an Admin
"I want to manage users and configure system rules so that the platform operates according to department policies."

---

## 6. Release Planning

### Phase 1: MVP (Current)
- All 7 roles with basic dashboards
- PS seizure entry (6-step wizard)
- SHO approval queue
- Auction Cell lot creation (6-step)
- Live auction with real-time bidding
- Bidder registration and bidding
- Mock API layer
- Session-based auth

### Phase 2: Enhancements
- Real backend integration
- VAHAN/CCTNS API integration
- Payment gateway integration
- Auto-bid feature
- Email/SMS notifications
- Advanced reporting

### Phase 3: Scale
- Mobile responsive optimization
- Multi-district support
- Integration with state e-courts
- Advanced analytics dashboard

---

## 7. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Backend not ready for launch | High | Medium | Mock API layer allows full frontend development and testing |
| WebSocket instability in production | Medium | Medium | Fallback polling implemented; exponential backoff reconnection |
| VAHAN API downtime | Medium | Low | Manual entry fallback; cached vehicle data |
| Bidder disputes on auction results | Low | Medium | Complete audit trail; bid history with timestamps |
| Role permission bypass | High | Low | Frontend guards + future backend enforcement |

---

## 8. Appendix

### 8.1 Glossary
- **PS:** Police Station
- **SHO:** Station House Officer
- **EMD:** Earnest Money Deposit
- **H1:** Highest Bid (current winning bid)
- **RC:** Registration Certificate
- **CCTNS:** Crime and Criminal Tracking Network & Systems
- **VAHAN:** National Vehicle Registration Database

### 8.2 Reference Documents
- SETUP.md — Installation and setup instructions
- README.md — Complete project documentation
- AGENTS.md — Project overview for AI agents
- src/imports/Auction.md — Figma design specification
