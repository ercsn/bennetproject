# SiteHaul - Technical Architecture & Implementation Plan

## Executive Summary

SiteHaul is a mobile-first dispatch management system connecting **Dispatchers**, **Drivers**, **Office/Billing**, and a **4th-party supplier (Harbor Supply)**. This document outlines the technical architecture using **Expo** (React Native), **Railway** (backend hosting), and **Neon** (PostgreSQL).

---

## Technology Stack

### Frontend (Mobile Apps)
| Technology | Purpose |
|------------|---------|
| **Expo SDK 52+** | Cross-platform iOS/Android framework |
| **React Native** | UI components and native features |
| **Expo Router** | File-based navigation |
| **Zustand** | Lightweight state management |
| **React Query (TanStack)** | Server state, caching, real-time sync |
| **Expo Notifications** | Push notifications |
| **Expo Location** | GPS tracking (optional driver tracking) |
| **React Native Maps** | Map integration for directions |

### Backend (API Server)
| Technology | Purpose |
|------------|---------|
| **Node.js + Express** or **Fastify** | REST API server |
| **Railway** | Backend hosting & deployment |
| **Neon PostgreSQL** | Serverless Postgres database |
| **Prisma ORM** | Type-safe database access |
| **Socket.io** | Real-time updates (dispatch notifications) |
| **Twilio** | SMS messaging (dispatcher ↔ driver) |
| **Expo Push Service** | Native push notifications |
| **JWT + bcrypt** | Authentication |

### Supplier Portal (Harbor Supply)
| Technology | Purpose |
|------------|---------|
| **Next.js** (or simple React SPA) | Web portal for delivery requests |
| **Railway** | Hosted alongside API |
| **Shared Neon DB** | Same database, role-restricted access |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              SITEHAUL SYSTEM                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  DISPATCHER  │  │    DRIVER    │  │    OFFICE    │  │   HARBOR    │ │
│  │   (Mobile)   │  │   (Mobile)   │  │ (Mobile/Web) │  │   SUPPLY    │ │
│  │              │  │              │  │              │  │ (Web Portal)│ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                 │                  │        │
│         └────────────┬────┴────────┬────────┴──────────────────┘        │
│                      │             │                                    │
│                      ▼             ▼                                    │
│         ┌────────────────────────────────────────┐                      │
│         │           RAILWAY API SERVER           │                      │
│         │  ┌─────────────────────────────────┐   │                      │
│         │  │  Express/Fastify REST API       │   │                      │
│         │  │  Socket.io (Real-time)          │   │                      │
│         │  │  Prisma ORM                     │   │                      │
│         │  └─────────────────────────────────┘   │                      │
│         └────────────────┬───────────────────────┘                      │
│                          │                                              │
│                          ▼                                              │
│         ┌────────────────────────────────────────┐                      │
│         │           NEON POSTGRESQL              │                      │
│         │  ┌─────────────────────────────────┐   │                      │
│         │  │  Users, Trucks, Dispatches      │   │                      │
│         │  │  Billing Records, Delivery Reqs │   │                      │
│         │  └─────────────────────────────────┘   │                      │
│         └────────────────────────────────────────┘                      │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐                              │
│  │  Twilio (SMS)   │  │  Expo Push      │                              │
│  └─────────────────┘  └─────────────────┘                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Neon PostgreSQL)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ USERS & AUTH ============

enum UserRole {
  DISPATCHER
  DRIVER
  OFFICE
  SUPPLIER
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          UserRole
  isActive      Boolean   @default(true)
  pushToken     String?   // Expo push token
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  driverProfile    Driver?
  dispatchesCreated Dispatch[] @relation("DispatcherDispatches")
  supplierCompany  SupplierCompany? @relation(fields: [supplierCompanyId], references: [id])
  supplierCompanyId String?
  messages         Message[]
}

model Driver {
  id          String   @id @default(cuid())
  user        User     @relation(fields: [userId], references: [id])
  userId      String   @unique
  licenseNumber String?
  licenseExpiry DateTime?

  // Current assignment
  currentTruck   Truck?  @relation(fields: [currentTruckId], references: [id])
  currentTruckId String?

  dispatches   Dispatch[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// ============ TRUCKS ============

enum TruckStatus {
  AVAILABLE
  IN_USE
  MAINTENANCE
  OUT_OF_SERVICE
}

model Truck {
  id            String      @id @default(cuid())
  truckNumber   String      @unique  // e.g., "T-101"
  licensePlate  String
  make          String?
  model         String?
  year          Int?
  capacity      String?     // e.g., "20 tons"
  truckType     String?     // e.g., "Dump Truck", "Flatbed"
  status        TruckStatus @default(AVAILABLE)
  notes         String?

  drivers       Driver[]
  dispatches    Dispatch[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

// ============ DISPATCHES ============

enum DispatchStatus {
  PENDING       // Created, not yet sent to driver
  ASSIGNED      // Sent to driver
  ACKNOWLEDGED  // Driver acknowledged
  EN_ROUTE      // Driver on the way
  ARRIVED       // Driver arrived at location
  COMPLETED     // Job finished
  CANCELLED     // Cancelled
}

enum WageType {
  PREVAILING
  NON_PREVAILING
  PRIVATE
  B2B
}

model Dispatch {
  id              String         @id @default(cuid())
  dispatchNumber  String         @unique  // Auto-generated: DIS-20240115-001

  // Assignment
  dispatcher      User           @relation("DispatcherDispatches", fields: [dispatcherId], references: [id])
  dispatcherId    String
  driver          Driver         @relation(fields: [driverId], references: [id])
  driverId        String
  truck           Truck          @relation(fields: [truckId], references: [id])
  truckId         String

  // Job Details
  clientCompany   String
  contactName     String?
  contactPhone    String?

  // Location
  pickupAddress   String?
  deliveryAddress String
  deliveryLat     Float?
  deliveryLng     Float?
  directions      String?        // Special directions/notes

  // Materials
  materialType    String         // e.g., "Dirt", "Aggregate", "Gravel"
  quantity        String?        // e.g., "3 loads"

  // Scheduling
  scheduledDate   DateTime
  scheduledTime   String?        // e.g., "7:00 AM"
  estimatedDuration String?

  // Status tracking
  status          DispatchStatus @default(PENDING)
  acknowledgedAt  DateTime?
  enRouteAt       DateTime?
  arrivedAt       DateTime?
  completedAt     DateTime?

  // Special criteria
  specialCriteria String?
  notes           String?

  // Billing linkage
  billingRecord   BillingRecord?

  // If originated from supplier request
  deliveryRequest DeliveryRequest? @relation(fields: [deliveryRequestId], references: [id])
  deliveryRequestId String?        @unique

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

// ============ BILLING ============

enum BillingStatus {
  PENDING
  INVOICED
  PAID
  DISPUTED
}

model BillingRecord {
  id              String        @id @default(cuid())
  invoiceNumber   String?       // Generated when invoiced

  dispatch        Dispatch      @relation(fields: [dispatchId], references: [id])
  dispatchId      String        @unique

  // Client info (denormalized for billing)
  clientCompany   String
  clientContact   String?

  // Rates & Wages
  wageType        WageType
  hourlyRate      Decimal?      @db.Decimal(10, 2)
  flatRate        Decimal?      @db.Decimal(10, 2)
  hours           Decimal?      @db.Decimal(5, 2)
  totalAmount     Decimal?      @db.Decimal(10, 2)

  // Timestamps from dispatch
  jobDate         DateTime
  startTime       DateTime?
  endTime         DateTime?

  // Status
  status          BillingStatus @default(PENDING)
  notes           String?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

// ============ SUPPLIER INTEGRATION (HARBOR SUPPLY) ============

model SupplierCompany {
  id          String   @id @default(cuid())
  name        String   // "Harbor Supply"
  apiKey      String   @unique  // For API authentication
  contactEmail String
  contactPhone String?
  isActive    Boolean  @default(true)

  users       User[]
  deliveryRequests DeliveryRequest[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum DeliveryRequestStatus {
  PENDING     // Submitted, awaiting dispatcher review
  APPROVED    // Dispatcher approved, dispatch created
  REJECTED    // Dispatcher rejected
  CANCELLED   // Supplier cancelled
}

model DeliveryRequest {
  id              String               @id @default(cuid())
  requestNumber   String               @unique  // REQ-20240115-001

  supplier        SupplierCompany      @relation(fields: [supplierId], references: [id])
  supplierId      String

  // Customer info (Harbor Supply's customer)
  customerName    String
  customerPhone   String?
  customerEmail   String?

  // Delivery details
  deliveryAddress String
  deliveryLat     Float?
  deliveryLng     Float?

  // Materials
  materials       String               // Description of materials
  quantity        String?
  weight          String?

  // Timing
  requestedDate   DateTime
  requestedTime   String?              // Preferred time window
  isUrgent        Boolean              @default(false)

  // Status
  status          DeliveryRequestStatus @default(PENDING)
  dispatcherNotes String?
  rejectionReason String?

  // Link to dispatch if approved
  dispatch        Dispatch?

  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
}

// ============ MESSAGING ============

model Message {
  id          String   @id @default(cuid())
  sender      User     @relation(fields: [senderId], references: [id])
  senderId    String
  recipientPhone String
  content     String
  sentViaSms  Boolean  @default(false)
  sentViaPush Boolean  @default(false)
  readAt      DateTime?
  createdAt   DateTime @default(now())
}

// ============ NOTIFICATIONS ============

model Notification {
  id          String   @id @default(cuid())
  userId      String
  title       String
  body        String
  type        String   // "dispatch_assigned", "no_work_tomorrow", etc.
  data        Json?    // Additional payload
  readAt      DateTime?
  createdAt   DateTime @default(now())
}
```

---

## Feature Breakdown by Role

### 1. Dispatcher App Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Dashboard** | Overview of today's dispatches, pending requests, driver availability | Medium |
| **Create Dispatch** | Multi-step form: select truck/driver, enter job details, location | Medium |
| **Truck/Driver Management** | View availability, assign/reassign trucks | Low |
| **Delivery Request Queue** | View pending Harbor Supply requests, approve/reject | Medium |
| **Real-time Updates** | Live status changes from drivers | Medium |
| **Direct Messaging** | Text drivers from app (Twilio integration) | Medium |
| **Schedule View** | Calendar view of upcoming dispatches | Medium |
| **Notifications** | Push alerts for new requests, status changes | Low |

### 2. Driver App Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Today/Tomorrow View** | Simple list of assigned dispatches | Low |
| **Dispatch Details** | View full job info, map link, directions | Low |
| **Acknowledge Job** | Confirm receipt of dispatch | Low |
| **Status Updates** | One-tap: En Route → Arrived → Complete | Low |
| **Map Integration** | Open native maps with destination | Low |
| **Notifications** | Push alerts for new assignments, messages | Low |
| **No Work Alerts** | Receive "no work tomorrow" notifications | Low |

### 3. Office/Billing Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Billing Dashboard** | View all billing records | Medium |
| **Record Details** | View full billing info tied to dispatch | Low |
| **Edit Rates/Hours** | Adjust billing before invoicing | Medium |
| **Export Data** | CSV/Excel export for invoicing | Medium |
| **Filter/Search** | By date, client, status, wage type | Medium |
| **Mark as Invoiced/Paid** | Status management | Low |

### 4. Harbor Supply Portal (Web)

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Login Portal** | Secure supplier authentication | Low |
| **Submit Delivery Request** | Form with customer, address, materials | Medium |
| **View Request Status** | Track pending/approved/rejected requests | Low |
| **Request History** | Past delivery requests | Low |
| **API Access** | Optional API for automated submissions | Medium |

---

## API Endpoints Structure

```
/api/v1
├── /auth
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh-token
│   └── POST /register-push-token
│
├── /users
│   ├── GET /me
│   └── PUT /me
│
├── /trucks
│   ├── GET /                    # List all trucks
│   ├── GET /:id                 # Get truck details
│   ├── POST /                   # Create truck (admin)
│   ├── PUT /:id                 # Update truck
│   └── GET /available           # Available trucks
│
├── /drivers
│   ├── GET /                    # List drivers
│   ├── GET /available           # Available drivers
│   └── GET /:id                 # Driver details
│
├── /dispatches
│   ├── GET /                    # List dispatches (filtered by role)
│   ├── POST /                   # Create dispatch (dispatcher only)
│   ├── GET /:id                 # Dispatch details
│   ├── PUT /:id                 # Update dispatch
│   ├── PUT /:id/status          # Update status (driver)
│   ├── POST /:id/acknowledge    # Driver acknowledges
│   └── GET /today               # Today's dispatches
│
├── /billing
│   ├── GET /                    # List billing records (office only)
│   ├── GET /:id                 # Billing details
│   ├── PUT /:id                 # Update billing record
│   └── POST /export             # Export to CSV
│
├── /delivery-requests           # Harbor Supply integration
│   ├── GET /                    # Pending requests (dispatcher)
│   ├── POST /                   # Submit request (supplier)
│   ├── PUT /:id/approve         # Approve request
│   ├── PUT /:id/reject          # Reject request
│   └── GET /history             # Supplier's past requests
│
├── /messages
│   ├── POST /send               # Send SMS to driver
│   └── GET /history/:userId     # Message history
│
└── /notifications
    ├── POST /send               # Send push notification
    └── POST /no-work-alert      # Send "no work" to all drivers
```

---

## Real-time Events (Socket.io)

```javascript
// Events emitted by server
'dispatch:created'      // New dispatch created
'dispatch:updated'      // Status changed
'dispatch:assigned'     // Dispatch assigned to driver
'delivery-request:new'  // New Harbor Supply request
'message:received'      // New message

// Events from clients
'driver:status-update'  // Driver updating location/status
'dispatch:acknowledge'  // Driver acknowledges job
```

---

## Implementation Phases & Timeline

### Phase 1: Foundation (Weeks 1-3)
**Goal:** Core infrastructure, authentication, basic CRUD

| Task | Duration | Details |
|------|----------|---------|
| Project setup (Expo + Express + Neon) | 2-3 days | Monorepo structure, configs |
| Database schema & Prisma setup | 2 days | All tables, migrations |
| Authentication system | 3-4 days | JWT, role-based auth, login screens |
| Basic API endpoints | 3-4 days | CRUD for trucks, drivers, users |
| Push notification infrastructure | 2 days | Expo Push setup |
| Basic navigation & screens | 3-4 days | All role-specific screen shells |

**Deliverables:** Users can log in, view their dashboard shell

---

### Phase 2: Core Dispatch Flow (Weeks 4-6)
**Goal:** End-to-end dispatch creation and driver workflow

| Task | Duration | Details |
|------|----------|---------|
| Dispatcher: Create Dispatch UI | 4-5 days | Multi-step form, truck/driver selection |
| Dispatcher: Dashboard & lists | 3 days | Today view, all dispatches |
| Driver: Dispatch list view | 2-3 days | Today/Tomorrow tabs |
| Driver: Dispatch details | 2 days | Full info, map link |
| Driver: Status updates | 2 days | Acknowledge, en route, complete |
| Real-time updates (Socket.io) | 3-4 days | Live status changes |
| Push notifications | 2-3 days | New assignment alerts |

**Deliverables:** Dispatcher can create jobs, drivers see and update them in real-time

---

### Phase 3: Billing Integration (Weeks 7-8)
**Goal:** Automatic billing records, office dashboard

| Task | Duration | Details |
|------|----------|---------|
| Auto-create billing on dispatch | 1-2 days | Backend logic |
| Office dashboard | 3-4 days | Billing list, filters |
| Billing record details/edit | 2-3 days | Rate entry, notes |
| Export functionality | 2-3 days | CSV generation |
| Status management | 1-2 days | Mark invoiced/paid |

**Deliverables:** Office sees all billing records, can export for invoicing

---

### Phase 4: Harbor Supply Integration (Weeks 9-10)
**Goal:** 4th-party supplier portal and integration

| Task | Duration | Details |
|------|----------|---------|
| Supplier web portal (Next.js) | 4-5 days | Login, request form, history |
| Delivery request API | 2 days | Submission, status tracking |
| Dispatcher: Request queue | 2-3 days | View pending, approve/reject |
| Convert request to dispatch | 2 days | Approval workflow |
| Supplier notifications | 1-2 days | Email/status updates |

**Deliverables:** Harbor Supply can submit requests, dispatchers can approve

---

### Phase 5: Messaging & Notifications (Week 11)
**Goal:** Full communication system

| Task | Duration | Details |
|------|----------|---------|
| Twilio SMS integration | 2-3 days | Dispatcher ↔ driver texting |
| In-app messaging UI | 2-3 days | Message threads |
| "No work tomorrow" alerts | 1 day | Broadcast to all drivers |
| Notification preferences | 1 day | User settings |

**Deliverables:** Full in-app and SMS communication

---

### Phase 6: Polish & Deployment (Weeks 12-13)
**Goal:** Production-ready app

| Task | Duration | Details |
|------|----------|---------|
| UI/UX polish | 3-4 days | Loading states, error handling |
| Testing & bug fixes | 3-4 days | End-to-end testing |
| App Store preparation | 2-3 days | Icons, screenshots, descriptions |
| Railway production setup | 1-2 days | Environment, SSL, monitoring |
| iOS/Android builds & submission | 2-3 days | TestFlight, Play Store |

**Deliverables:** Apps submitted to stores, backend live

---

## Total Timeline Summary

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: Foundation | 3 weeks | Week 3 |
| Phase 2: Core Dispatch | 3 weeks | Week 6 |
| Phase 3: Billing | 2 weeks | Week 8 |
| Phase 4: Harbor Supply | 2 weeks | Week 10 |
| Phase 5: Messaging | 1 week | Week 11 |
| Phase 6: Polish & Deploy | 2 weeks | Week 13 |

### **Total Estimate: 12-14 weeks** (3-3.5 months)

---

## Budget Considerations

### Development Costs
- Mobile app (Expo): Primary development effort
- Backend API (Railway): Moderate effort
- Supplier portal (Next.js): Smaller effort
- Integration work: SMS, push, maps

### Ongoing Infrastructure Costs (Monthly)

| Service | Estimated Cost |
|---------|----------------|
| **Railway** (API hosting) | $20-50/mo |
| **Neon** (PostgreSQL) | $0-25/mo (free tier generous) |
| **Twilio** (SMS) | ~$0.01/SMS + phone number |
| **Expo Push** | Free |
| **Apple Developer** | $99/year |
| **Google Play** | $25 one-time |

**Estimated monthly infra: $50-100/mo** at launch scale

---

## Recommended Harbor Supply Integration Approach

Based on your requirements, I recommend a **hybrid approach**:

### Option A: Web Portal (Primary) ✓ Recommended
- Secure login for Harbor Supply staff
- Simple form-based delivery request submission
- Real-time status tracking
- No technical integration needed on their end

### Option B: API Access (Future)
- If Harbor Supply has their own system
- Provide REST API with API key authentication
- Webhook notifications for status changes
- Can be added later without architectural changes

### Why Portal First:
1. **Immediate usability** - No development on Harbor Supply's end
2. **Lower barrier** - Staff can use immediately
3. **Control** - You manage the interface
4. **API-ready** - Same backend supports API when needed

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Real-time reliability | Socket.io with fallback polling |
| Push notification delivery | Also send SMS for critical alerts |
| Offline scenarios | Local caching, sync when online |
| Scale concerns | Neon + Railway auto-scale |
| App Store rejection | Follow guidelines, test thoroughly |

---

## Next Steps

1. **Confirm tech stack** - Expo + Railway + Neon approved?
2. **Define MVP scope** - What's essential for launch?
3. **Design mockups** - UI/UX before code
4. **Database finalization** - Review schema
5. **Begin Phase 1** - Project scaffolding

---

## File Structure (Proposed)

```
sitehaul/
├── apps/
│   ├── mobile/                 # Expo app
│   │   ├── app/                # Expo Router screens
│   │   │   ├── (auth)/         # Login screens
│   │   │   ├── (dispatcher)/   # Dispatcher screens
│   │   │   ├── (driver)/       # Driver screens
│   │   │   └── (office)/       # Office screens
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/           # API clients
│   │   └── stores/             # Zustand stores
│   │
│   ├── api/                    # Express/Fastify backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── supplier-portal/        # Next.js web app
│       └── src/
│           ├── app/
│           └── components/
│
├── packages/
│   └── shared/                 # Shared types, utilities
│
└── package.json                # Monorepo root
```

---

*Document created: February 2026*
*Stack: Expo + Railway + Neon*
