# SiteHaul - Scope of Work

**Prepared for:** Allegiance Trucking and Services / Harbor Soils
**Date:** February 2026
**Version:** 1.0 (MVP)

---

## Project Overview

SiteHaul is a mobile-first dispatch management application designed to streamline operations between dispatchers, drivers, and office billing staff. The app will be available on both iOS and Android devices.

### Business Objective

Replace manual dispatch coordination (phone calls, texts, paper) with a centralized mobile app that:
- Allows dispatchers to assign jobs to drivers instantly
- Gives drivers a clear view of their assignments
- Automatically generates billing records for the office
- Reduces miscommunication and missed jobs

---

## What's Included

### 1. Dispatcher Mobile App

| Feature | Description |
|---------|-------------|
| **Dashboard** | View today's dispatches at a glance, see driver availability |
| **Create Dispatch** | Assign truck and driver, enter job details (client, location, materials, time, special instructions) |
| **Manage Dispatches** | View all dispatches, edit details, cancel if needed |
| **Driver Availability** | See which drivers and trucks are available |
| **Push Notifications** | Receive alerts when drivers update job status |
| **Send Alerts** | Send "no work tomorrow" notification to all drivers |

### 2. Driver Mobile App

| Feature | Description |
|---------|-------------|
| **Today / Tomorrow View** | Simple list of assigned jobs |
| **Job Details** | View full dispatch info: client, address, materials, directions, special criteria |
| **Open in Maps** | One-tap to open destination in Apple Maps or Google Maps |
| **Acknowledge Job** | Confirm receipt of assignment |
| **Status Updates** | Mark job as: En Route → Arrived → Completed |
| **Push Notifications** | Receive alerts for new assignments and messages |

### 3. Office / Billing Dashboard

| Feature | Description |
|---------|-------------|
| **Billing Records** | Automatically created when dispatch is completed |
| **Record Details** | Client name, job date, wage type, timestamps, notes |
| **Edit Records** | Add rates, hours, adjust details before invoicing |
| **Filter & Search** | Find records by date range, client, or status |
| **Export to CSV** | Download billing data for import into accounting software |
| **Status Tracking** | Mark records as Pending → Invoiced → Paid |

### 4. Core Infrastructure

| Component | Description |
|-----------|-------------|
| **User Accounts** | Secure login for all users with role-based access |
| **Role Separation** | Drivers only see their jobs; billing data hidden from drivers |
| **Push Notifications** | Real-time alerts for job assignments and updates |
| **Cloud Database** | Secure, backed-up data storage |
| **iOS App** | Available on Apple App Store |
| **Android App** | Available on Google Play Store |

---

## What's Not Included (Future Phases)

The following features are intentionally deferred to keep the initial build focused and deliverable. They can be added in future phases:

| Feature | Reason for Deferral |
|---------|---------------------|
| **Real-time live updates** | Pull-to-refresh is sufficient for V1; adds complexity |
| **SMS/Text messaging** | Push notifications cover this need; SMS adds cost |
| **Harbor Supply portal** | Can submit requests via phone/email initially |
| **GPS driver tracking** | Not essential for dispatch workflow |
| **Offline mode** | Requires internet; drivers typically have cell service |
| **In-app chat** | Phone calls and standard texting work for now |
| **Recurring/scheduled jobs** | Can be added once core workflow is proven |
| **Customer portal** | Clients continue to call in orders as they do today |

---

## User Roles & Access

| Role | Access Level |
|------|--------------|
| **Dispatcher** | Create/edit dispatches, view all drivers and trucks, send notifications |
| **Driver** | View own assignments only, update job status |
| **Office** | View/edit billing records, export data, no dispatch access |
| **Admin** | Full access, manage users, trucks, and system settings |

---

## Technical Approach

| Component | Technology |
|-----------|------------|
| Mobile App | Expo (React Native) - single codebase for iOS and Android |
| Backend API | Node.js hosted on Railway |
| Database | Neon PostgreSQL (cloud-hosted, automatic backups) |
| Notifications | Expo Push Notifications (free, reliable) |
| Authentication | Secure JWT-based login |

### Why This Stack

- **Expo**: Industry-standard for cross-platform mobile apps. One codebase = faster development, easier maintenance.
- **Railway**: Simple, affordable hosting that scales with usage.
- **Neon**: Modern PostgreSQL with generous free tier, automatic backups.

---

## Estimated Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 1: Setup & Auth** | 1.5 weeks | Project structure, database, user login |
| **Phase 2: Dispatcher Features** | 2 weeks | Create dispatch, dashboard, truck/driver management |
| **Phase 3: Driver Features** | 1.5 weeks | Job list, details, status updates, map integration |
| **Phase 4: Billing Features** | 1.5 weeks | Billing dashboard, record management, CSV export |
| **Phase 5: Polish & Deploy** | 1.5 weeks | Testing, bug fixes, App Store submission |

### **Total: 8 weeks**

*Timeline assumes consistent availability for feedback and testing during development.*

---

## Deliverables

Upon completion, you will receive:

1. **iOS App** - Published to Apple App Store (or TestFlight for internal distribution)
2. **Android App** - Published to Google Play Store (or internal APK)
3. **Admin Access** - Ability to add/remove users, trucks, and drivers
4. **Documentation** - User guide for dispatchers, drivers, and office staff
5. **Source Code** - Full ownership of all code
6. **Hosting Setup** - Railway and Neon accounts configured and running

---

## Ongoing Costs (Post-Launch)

| Service | Estimated Monthly Cost |
|---------|------------------------|
| Railway (API hosting) | $0-5 |
| Neon (Database) | $0 (free tier) |
| Expo Push Notifications | $0 (free) |
| Apple Developer Account | $99/year |
| Google Play Account | $25 one-time |

**Estimated monthly infrastructure: $0-5/month**

---

## Assumptions

1. Allegiance Trucking will provide timely feedback during development
2. A designated point of contact will be available for questions
3. Test users (1-2 dispatchers, 2-3 drivers) will be available for testing before launch
4. Client will provide Apple Developer and Google Play account credentials for publishing
5. Internet connectivity is available for all users during app usage

---

## Out of Scope

- Integration with existing accounting/ERP software (can be discussed for future phase)
- Custom hardware or devices
- Training beyond basic documentation
- Ongoing maintenance and support (can be discussed separately)
- Harbor Supply integration (Phase 2 scope)

---

## Success Criteria

The project will be considered complete when:

1. Dispatchers can create and assign jobs from their phones
2. Drivers can view, acknowledge, and update job status
3. Billing records are automatically created for completed jobs
4. Office staff can view, edit, and export billing data
5. Apps are available for download on iOS and Android
6. All user roles have appropriate access restrictions

---

## Next Steps

1. **Review & Approve** - Confirm this scope meets your needs
2. **Kickoff** - Gather initial data (truck list, driver list, typical job types)
3. **Development Begins** - Weekly progress updates provided
4. **Testing Phase** - Your team tests with real scenarios
5. **Launch** - Apps published to stores

---

*Questions? Let's discuss any adjustments needed before we begin.*
