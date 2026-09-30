# Campus Orbit

> **The Intelligent Campus Event & Community Platform**

**Created & Developed by Pradeepto Dixit**

- **GitHub Repository**: [https://github.com/pradeeptodixit/Campus-Orbit](https://github.com/pradeeptodixit/Campus-Orbit)
- **Live Demo**: [https://campus-orbit-sand.vercel.app/](https://campus-orbit-sand.vercel.app/)

---

## 🌟 Overview

Campus Orbit is an intelligent campus event and community platform designed to connect students with college societies, events, registrations, desk check-ins, and campus activities.

---

## 👨‍💻 Author & Project Ownership

**Pradeepto Dixit**  
Creator & Full-Stack Developer of Campus Orbit.

### Project Ownership & Attribution
Campus Orbit is an original software project created and developed by Pradeepto Dixit. Copyright © 2026 Pradeepto Dixit. All rights reserved. Third-party libraries, frameworks, icons, fonts, and open-source components remain subject to their respective licenses.

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
- **Admin Portal & Authentication**: Secure admin login (`admin@campusorbit.edu` / `admin123`).
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
- **Styling**: Tailwind CSS v4, Dark Glassmorphism, Custom Design Tokens
- **Icons**: Lucide React
- **Database & ORM**: SQLite (`dev.db`), Prisma ORM 5.22.0
- **Validation**: Zod
- **Micro-Interactions**: Canvas Confetti, QRCode Generator

---

## 🚀 Running Locally

## 🔐 Demo Credentials

- **Admin Portal URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@campusorbit.edu`
- **Password**: `admin123`

---

## 📁 Technical Documentation

- [System Architecture](docs/ARCHITECTURE.md)