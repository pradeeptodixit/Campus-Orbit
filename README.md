# 🚀 CampusConnect — Intelligent College Club & Event Management Platform

> **"One Campus. Every Event. One Intelligent Experience."**

CampusConnect is a production-quality college club and event management platform built as a recruitment portfolio project. It connects students, society leads, event organizers, and campus administrators into a unified digital operating system.

---

## 🌟 Key Features

### 🎓 Student Experience
- **Home Landing & Campus Pulse**: Live summary of campus activity calculated strictly from active database records.
- **Smart Event Discovery**: Search, filter by category (Hackathon, Workshop, Seminar, Tech Talk, Competition, Cultural), date, venue, and availability.
- **Grounded Smart Recommendations**: Rule-based recommendation engine based on student interest selections with explainable match reasons.
- **Event Detail & Dynamic Countdown**: Real-time countdown timer ("Starts in X Days Y Hours"), venue location maps, and event timeline.
- **Smart Registration Engine**: Duplicate registration prevention based on `[eventId, email]` composite uniqueness. Automatic waitlist placement when capacity is reached.
- **QR Registration Pass & Calendar**: Generates printable QR pass and `.ics` iCalendar invite download.
- **Personal Event Hub (`/my-events`)**: Student registration lookup using email or registration code (`CC-2026-XXXXX`).
- **Grounded Campus AI Assistant**: Live event chatbot backed strictly by real database queries.

### 🛡️ Admin & Society Lead Experience
- **Admin Portal & Authentication**: Secure admin login (`admin@campusconnect.edu` / `admin123`).
- **Full Event Lifecycle & Draft System**: Draft -> Published -> Registration Open -> Registration Closed -> Completed.
- **Event Health Checker**: Pre-publish validation panel (title, description, date, venue, capacity, deadline, conflicts).
- **Scheduling Conflict Detection**: Prevents double-booking same venue on overlapping date/time slots.
- **Event Duplication**: Duplicate existing events into draft mode for recurring workshops.
- **QR Check-In Scanner**: Desk entry scanner to verify passes, mark attendance, and block duplicate check-ins.
- **Filtered CSV Export**: Export registered student data to CSV respecting active filters.
- **Verifiable Analytics**: Attendance rate %, capacity utilization %, category distribution, and live system audit logs.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Glassmorphism, Custom Design Tokens
- **Icons**: Lucide React
- **Database & ORM**: SQLite (`dev.db`), Prisma ORM 5.22.0
- **Validation**: Zod
- **Micro-Interactions**: Canvas Confetti, QRCode Generator

---

## 📊 Database Schema

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("SUPER_ADMIN")
  createdAt    DateTime @default(now())
}

model Club {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String
  category    String
  events      Event[]
}

model Event {
  id                   String   @id @default(uuid())
  clubId               String
  title                String
  slug                 String   @unique
  date                 DateTime
  venue                String
  capacity             Int
  status               String   @default("REGISTRATION_OPEN")
  registrations        Registration[]
}

model Registration {
  id               String   @id @default(uuid())
  registrationCode String   @unique
  eventId          String
  name             String
  email            String
  status           String   @default("CONFIRMED")
  @@unique([eventId, email])
}
```

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js v18+ 
- npm v9+

### 2. Installation
```bash
git clone https://github.com/your-username/campus-connect.git
cd campus-connect
npm install
```

### 3. Database Setup & Seeding
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Credentials

- **Admin Portal URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@campusconnect.edu`
- **Password**: `admin123`

---

## 📁 Technical Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [Technical Interview Preparation Guide](docs/INTERVIEW_PREPARATION.md)

---

## 🏆 Recruitment Demo Flow (5-7 Mins)

1. **Home (`/`)**: Show Campus Pulse & Smart Discovery.
2. **Events (`/events`)**: Test search & category filtering.
3. **Event Detail (`/events/[slug]`)**: View dynamic countdown, timeline, and capacity indicator.
4. **Register**: Submit a student registration & view the generated QR Pass.
5. **Admin Portal (`/admin`)**: Log in as admin, view live analytics updates.
6. **Check-In (`/admin/checkin`)**: Scan or enter the pass code (`CC-2026-101`) to verify attendance.
7. **CSV Export (`/admin/registrations`)**: Export filtered registration records.
