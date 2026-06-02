# Appointmenter

A full-stack meeting room booking application built with Vue 3 and Express + Prisma. It goes beyond simple CRUD operations by implementing concurrency control, strict data validation, and anti-abuse mechanics to ensure fair and accurate resource allocation.

---

## 🚀 Features

- **User Authentication:** Secure sign-up, login, and JWT-based session management.
- **Smart Booking System:** Select meeting rooms, dates, and times with enforced logical constraints (15 min - 4 hour durations).
- **Booking Management:** View upcoming schedules, edit/reschedule active bookings, and cancel appointments.
- **Historical Logs:** View a read-only history of past (completed or cancelled) bookings.
- **Account Recovery:** Email-based password reset via Resend (15-minute token expiry).
- **Account Deletion:** Users can permanently delete their accounts, triggering automated cleanup of their data.

---

## 🧠 Architecture & Problem Solving

This project was built with edge cases and distributed system behaviors in mind:

* **Concurrency Control (Optimistic Locking):** Prevents double-booking race conditions. If two users attempt to book the exact same time slot simultaneously, the system uses a database version column. The first request updates the version, and the second request is rejected as stale data.
* **Strict Data Validation:** Backend guardrails prevent illogical inputs, such as submitting an end time that occurs before the start time, or booking durations outside the allowed limits.
* **Anti-Abuse Mechanics:** 
  * Capped reschedules (max 5 per month) to prevent calendar hoarding.
  * Implemented a **Flag Score** system for accountability. Users who cancel at the last minute (within 15 minutes of the start time) are flagged.
* **Cascading Cleanup:** Prevents "ghost bookings." If a user with future appointments deletes their account, the database automatically purges those appointments to free up room inventory.
* **Historical Immutability:** Time-based state locks ensure that once a meeting time has passed, the appointment data becomes read-only and cannot be altered or cancelled.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vue 3, Pinia (State Management), Vue Router |
| **Styling** | Tailwind CSS v4 (Bauhaus-inspired design) |
| **Backend** | Node.js, Express (v5) |
| **Database** | PostgreSQL (Neon), Prisma ORM |
| **Security** | JSON Web Tokens (JWT) |
| **Email Service** | Resend |

---

## 📦 Project Structure

```text
appoinmenter/
├── backend/                  # Express API server
│   ├── src/
│   │   ├── config/           # Database connection (Prisma)
│   │   ├── controllers/      # Route handlers (auth, bookings, rooms)
│   │   ├── middleware/       # Auth middleware (JWT verification)
│   │   ├── routes/           # Express route definitions
│   │   ├── utils/            # Token generation, email service
│   │   └── server.js         # App entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── .env                  # Environment variables (not committed)
│
└── frontend/                 # Vue 3 SPA
    ├── src/
    │   ├── components/       # Reusable components (Navbar)
    │   ├── views/            # Page components
    │   ├── stores/           # Pinia stores (auth, bookings)
    │   ├── router/           # Vue Router config
    │   └── assets/           # Static assets (images, CSS)
    ├── index.html
    └── vite.config.js
