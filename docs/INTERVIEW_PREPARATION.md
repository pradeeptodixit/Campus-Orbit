# Campus Orbit — Technical Interview Preparation Guide

**Created & Developed by Pradeepto Dixit**  
GitHub: [https://github.com/pradeeptodixit/Campus-Orbit](https://github.com/pradeeptodixit/Campus-Orbit)  
Live Demo: [https://campus-orbit-sand.vercel.app/](https://campus-orbit-sand.vercel.app/)

---

### Q1: Why did you build Campus Orbit?
**Answer:** Campus events and society registrations in colleges are often fragmented across Google Forms, manual spreadsheets, and WhatsApp groups. This leads to duplicate registrations, lost student passes, unknown attendance metrics, and scheduling conflicts in campus auditoriums. I created and developed Campus Orbit as an integrated campus event intelligence platform that unifies event discovery, registration with instant duplicate prevention, QR desk check-ins, and verifiable analytics.

---

### Q2: What problem does it solve?
**Answer:** It solves:
1. **Student Pain Points**: Fragmented event schedules, missing calendar invites, manual attendance entry.
2. **Society Organizer Pain Points**: Venue double-booking, manual paper check-ins, inability to track real attendance rates.
3. **Campus Admin Pain Points**: Lack of verifiable metrics on venue utilization and student participation.

---

### Q3: Why did you choose this tech stack (Next.js, TypeScript, Tailwind, Prisma, SQLite)?
**Answer:**
- **Next.js (App Router)**: Enables unified frontend rendering and server-side API route handlers in a single performant framework.
- **TypeScript**: Enforces strict type safety across database queries, API payloads, and React components.
- **Tailwind CSS**: Allows rapid, custom design system creation with micro-interactions and dark-mode glassmorphism.
- **Prisma ORM & SQLite**: Provides zero-dependency, self-contained relational database management with instant migrations and full type-generation out of the box.

---

### Q4: Explain your system architecture.
**Answer:** The architecture follows a layered model:
- **Presentation Layer**: React Client Components (`Navbar`, `EventCard`, `CampusPulse`, `SmartDiscovery`).
- **Validation & Business Logic**: Server-side API route handlers (`/api/events`, `/api/registrations`, `/api/checkins`) backed by Zod schemas.
- **Data Access Layer**: Prisma ORM singleton accessing SQLite (`dev.db`).
- **Utility Layer**: Deterministic helpers for scheduling conflict detection, status derivations, `.ics` calendar file generation, and CSV exporting.

---

### Q5: Explain the database schema.
**Answer:** The schema consists of 7 models in `prisma/schema.prisma`:
- `User` (Admin & Organizers)
- `Club` (Societies)
- `Event` (Linked to Club)
- `Registration` (Linked to Event with `[eventId, email]` composite unique constraint)
- `CheckIn` (Linked to Registration with 1:1 relation)
- `Feedback` (Linked to Event and optional Registration)
- `AuditLog` (System-wide action audit trail)

---

### Q6: How does registration work?
**Answer:** When a student submits the registration form, the request hits `POST /api/registrations`. The server validates fields with Zod, checks registration deadlines and capacity. If capacity is full, the student is assigned a `WAITLISTED` status with `waitlistPosition`. Otherwise, a unique registration code (e.g. `CC-2026-89412`) is created and returned alongside a downloadable QR Pass and `.ics` file.

---

### Q7: How do you prevent duplicate registrations?
**Answer:** We enforce duplicate prevention at both database and application levels. In Prisma, `Registration` has a `@@unique([eventId, email])` constraint. Before creating a record, the server queries for an existing registration with the same `eventId` and normalized `email`. If found, it returns an HTTP `409 Conflict` with `"You are already registered for this event."` and returns the existing pass code.

---

### Q8: How does admin authentication work?
**Answer:** Admins authenticate via `POST /api/admin/login` using credentials (e.g. `admin@campusorbit.edu` / `admin123`). Upon verification, the server sets an `HttpOnly` secure session cookie (`campusorbit_admin_session`) and returns admin role state to protect client routes.

---

### Q9: How is authorization enforced?
**Answer:** Server-side API routes inspect session cookies and user roles (`SUPER_ADMIN`, `CLUB_ADMIN`, `ORGANIZER`). Destructive operations like `DELETE /api/events/[id]` verify authorization on the backend, ensuring client-side UI buttons cannot be bypassed.

---

### Q10: How does global search work?
**Answer:** `GlobalSearchModal` listens for `Cmd+K` / `Ctrl+K`. As the user types, it executes debounced queries against `GET /api/events` and `GET /api/clubs`, grouping results into Events and Societies for instant navigation.

---

### Q11: How does event filtering work?
**Answer:** Client and server filtering support parameters for `category`, `status`, `venue`, `clubId`, and `sort` (Soonest, Latest, Most Registered, Alphabetical). Queries construct Prisma `where` clauses dynamically.

---

### Q12: How does event capacity work?
**Answer:** Capacity is deterministic. We derive status via `getCapacityStatus(registeredCount, capacity)`:
- `< 65%`: `Seats Available` (Emerald)
- `65% - 89%`: `Filling Fast` (Indigo)
- `90% - 99%`: `Almost Full` (Amber)
- `>= 100%`: `Event Full` / `Waitlisted` (Red)

---

### Q13: How do you detect scheduling conflicts?
**Answer:** In `src/lib/utils.ts`, `detectSchedulingConflict` compares the target event's venue, date, and time slot against all existing active events. If another event occupies the same venue on the same date, creation/update is rejected with `409 Conflict` and an explicit alert: `"Venue is already booked from 2:00 PM - 4:00 PM for Event X"`.

---

### Q14: How does the QR check-in work?
**Answer:** Upon registration, the app generates a QR code payload (`CC-REG-2026-XXXXX`) using the `qrcode` library. At entry desk (`/admin/checkin`), organizers scan or enter the code. `POST /api/checkins` verifies the code, creates a `CheckIn` record, updates status to `CHECKED_IN`, and prevents duplicate check-ins.

---

### Q15: How do analytics work?
**Answer:** All analytics in `/admin/analytics` and `CampusPulse` are calculated directly from SQLite database records via SQL count/aggregation queries. Attendance rate is calculated as `(totalCheckIns / totalRegistrations) * 100`, making every metric 100% verifiable.

---

### Q16: What happens if the database fails?
**Answer:** API routes catch errors gracefully, returning structured JSON error payloads with proper HTTP status codes (500/503). UI components display friendly empty states with retry triggers instead of crashing or rendering blank pages.

---

### Q17: How did you make it responsive?
**Answer:** We used mobile-first Tailwind breakpoints (`sm:`, `md:`, `lg:`), responsive drawers for Navbar and filters, responsive tables with horizontal scrolling, and touch-friendly tap targets across 320px, 375px, 768px, 1024px, and 1440px viewports.

---

### Q18: How did you test it?
**Answer:** We verified unit logic (status derivations, capacity thresholds, conflict detection, CSV generator) and ran end-to-end user flows (Student registration -> QR pass generation -> Admin check-in scanner -> Real-time analytics update).

---

### Q19: What would you improve with more time?
**Answer:**
1. Integration with real email/SMS gateways (e.g. Resend / Twilio) for instant ticket delivery.
2. WebSockets / Server-Sent Events for real-time live seat counter updates.
3. Native mobile app integration via React Native / PWA offline service workers.

---

### Q20: What was the hardest engineering problem?
**Answer:** Ensuring zero data race conditions and duplicate entries during concurrent student registrations while maintaining strict seat capacity and automated waitlist position calculations, combined with client-side offline resilience and QR generation.
