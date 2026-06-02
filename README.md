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

A step-by-step guide to running this project on your local machine.

---

## Prerequisites

- **Node.js** v20.19.0 or v22.12.0+ — [Download](https://nodejs.org)
- **Git** — [Download](https://git-scm.com)
- A **PostgreSQL** database (the project uses [Neon](https://neon.tech) — a cloud PostgreSQL service)

Verify your installation:

```bash
node --version
npm --version
git --version
```

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/theshueeee/appointmenter.git
cd appointmenter
```

---

## Step 2: Set Up the Backend

```bash
cd backend
npm install
```

### 2a. Create the `.env` file

Create a file named `.env` inside the `backend/` directory with the following contents:

```env
DATABASE_URL="postgresql://neondb_owner:npg_HMzvw3gN2nCu@ep-bitter-block-ao6qfeyz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
NODE_ENV="development"
JWT_SECRET="U5gD7t1WUPJfKbcyrA7A/oL/MpDwvGhthArfVwheEvg="
JWT_EXPIRES_IN="7d"
RESEND_API_KEY="re_AP7vZA73_Mk5H6cT7MDhc5RmfaAZP3LWx"
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

> The `DATABASE_URL` already points to a Neon cloud database. You can use it as-is, or replace it with your own PostgreSQL connection string.

### 2b. Generate the Prisma Client

```bash
npx prisma generate
```

### 2c. Seed the Database

```bash
npm run seed
```

This creates 10 meeting rooms in the database that you can book.

### 2d. Start the Backend Server

```bash
npm run dev
```

You should see:

```
The Server is running on port 5000
DB Connected via Prisma
```

The backend API is now running at **http://localhost:5000**.

---

## Step 3: Set Up the Frontend

Open a **new terminal** window/tab, then:

```bash
cd frontend
npm install
```

### 3a. Start the Frontend Dev Server

```bash
npm run dev
```

You should see:

```
VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3002/
```

The frontend app is now running at **http://localhost:3002**.

---

## Step 4: Use the App

1. Open **http://localhost:3002** in your browser
2. **Register** a new account
3. **Log in**
4. **Book a meeting room** — select a room, date, and time slot
5. View your upcoming and past bookings

---

## Quick Reference — All Commands

**Terminal 1 — Backend:**

```bash
cd backend
npm install
npx prisma generate
npm run seed
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## Ports

| Service    | URL                        |
|------------|----------------------------|
| Backend    | http://localhost:5000       |
| Frontend   | http://localhost:3002       |

---

## Optional: Password Reset Emails

The project uses **Resend** for sending password reset emails. The API key and sender email are already configured in the `.env` file.

To test password reset:

1. Register an account
2. Go to the login page and click **"Forgot Password"**
3. Enter your email address
4. Check your inbox for the reset link

> **Note:** Resend's `onboarding@resend.dev` sender may only deliver to the email address associated with your Resend account during testing.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `Cannot find module` errors | Run `npm install` again in the correct directory |
| Database connection error | Verify the `DATABASE_URL` in `backend/.env` is correct |
| Port already in use | Change the port in `backend/.env` (`PORT=5001`) or `frontend/vite.config.js` |
| Prisma client not found | Run `npx prisma generate` in the `backend/` directory |
| CORS errors | Ensure the backend is running and `FRONTEND_URL` includes your frontend origin |

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Vue 3 + Pinia + Vue Router        |
| Styling    | Tailwind CSS v4                   |
| Backend    | Express v5                        |
| Database   | PostgreSQL + Prisma ORM           |
| Auth       | JWT (jsonwebtoken)                |
| Email      | Resend                            |
   
