# Appointmenter

A full-stack meeting room booking application built with Vue 3 and Express + Prisma.

This project goes beyond basic CRUD functionality by implementing concurrency control, strict validation rules, and anti-abuse mechanics to ensure fair and reliable meeting room allocation.

---

# 🚀 Features

## Authentication & Security

* Secure user registration and login
* JWT-based authentication and session management
* Email-based password reset using Resend
* 15-minute password reset token expiry

## Booking System

* Book meeting rooms by selecting room, date, and time
* Enforced booking duration limits (15 minutes – 4 hours)
* Edit or reschedule active bookings
* Cancel upcoming appointments
* View upcoming schedules and booking history

## Historical Records

* Read-only history for completed or cancelled bookings
* Automatic locking of expired appointments

## Account Management

* Permanent account deletion
* Automatic cleanup of future bookings after account deletion

---

# 🧠 Architecture & Problem Solving

This project was designed with real-world edge cases and distributed system behavior in mind.

## Concurrency Control (Optimistic Locking)

Prevents double-booking race conditions.

If two users attempt to reserve the same room and time slot simultaneously, the system uses a database version field to detect stale updates. The first request succeeds while subsequent conflicting requests are rejected.

## Strict Data Validation

Backend validation prevents:

* End times occurring before start times
* Booking durations outside allowed limits
* Invalid or malformed requests

## Anti-Abuse Mechanics

To prevent calendar hoarding and irresponsible booking behavior:

* Reschedules are capped at **5 per month**
* Users who cancel within **15 minutes** of the meeting start time receive a **Flag Score**

## Cascading Cleanup

When users delete their accounts, all future bookings are automatically removed to prevent "ghost bookings" from occupying room inventory.

## Historical Immutability

Once a meeting time has passed, the booking becomes permanently read-only and can no longer be edited or cancelled.

---

# 🛠 Tech Stack

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Frontend       | Vue 3, Pinia, Vue Router      |
| Styling        | Tailwind CSS v4               |
| Backend        | Node.js, Express v5           |
| Database       | PostgreSQL (Neon), Prisma ORM |
| Authentication | JSON Web Tokens (JWT)         |
| Email Service  | Resend                        |

---

# 📦 Project Structure

```text
appointmenter/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── views/
    │   ├── stores/
    │   ├── router/
    │   └── assets/
    ├── index.html
    └── vite.config.js
```

---

# ⚙️ Prerequisites

Before running the project, ensure you have:

* Node.js v20.19.0 or v22.12.0+
* Git
* PostgreSQL database (Neon is recommended)

## Verify Installation

```bash
node --version
npm --version
git --version
```

---

# 🔧 Local Setup

## Step 1 — Clone the Repository

```bash
git clone https://github.com/theshueeee/appointmenter.git
cd appointmenter
```

---

## Step 2 — Backend Setup

```bash
cd backend
npm install
```

### Create `.env`

Create a `.env` file inside the `backend/` directory:

```env
DATABASE_URL="your_database_url"
NODE_ENV="development"

JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"

RESEND_API_KEY="your_resend_api_key"
RESEND_FROM_EMAIL="your_sender_email"
```

> Never commit real API keys, database credentials, or secrets to GitHub.

### Generate Prisma Client

```bash
npx prisma generate
```

### Seed Database

```bash
npm run seed
```

This creates 10 meeting rooms for testing.

### Start Backend Server

```bash
npm run dev
```

Expected output:

```bash
The Server is running on port 5000
DB Connected via Prisma
```

Backend URL:

```text
http://localhost:5000
```

---

## Step 3 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

### Start Frontend Server

```bash
npm run dev
```

Expected output:

```bash
VITE v8.x.x ready in xxx ms

➜ Local: http://localhost:3002/
```

Frontend URL:

```text
http://localhost:3002
```

---

# 🧪 Using the Application

1. Open the frontend URL
2. Register a new account
3. Log in
4. Create a booking
5. View upcoming and historical bookings

---

# 📋 Quick Commands

## Backend

```bash
cd backend
npm install
npx prisma generate
npm run seed
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🌐 Default Ports

| Service  | URL                   |
| -------- | --------------------- |
| Backend  | http://localhost:5000 |
| Frontend | http://localhost:3002 |

---

# ✉️ Password Reset

The application uses Resend for password reset emails.

## Testing Password Reset

1. Register an account
2. Click "Forgot Password"
3. Enter your email address
4. Check your inbox for the reset link

> Note: Resend's default testing sender may only send emails to verified addresses during development.

---

# 🛠 Troubleshooting

| Issue                     | Solution                                                 |
| ------------------------- | -------------------------------------------------------- |
| `Cannot find module`      | Run `npm install` again                                  |
| Database connection error | Verify `DATABASE_URL`                                    |
| Port already in use       | Change the configured port                               |
| Prisma client missing     | Run `npx prisma generate`                                |
| CORS errors               | Ensure backend is running and frontend origin is allowed |

---

# 📌 Notes

This project focuses heavily on backend integrity and real-world system behavior rather than only frontend CRUD operations.

Key focus areas:

* Concurrency handling
* Data consistency
* Abuse prevention
* Lifecycle management
* Immutable historical records

---
