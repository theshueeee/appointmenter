# Appointmenter

A meeting room booking application built with Vue 3 (frontend) and Express + Prisma (backend). Features user authentication, booking management, and password reset via email.

---

## Prerequisites

- **Node.js** v20.19.0 or v22.12.0+
- **npm**
- A **PostgreSQL** database (this project uses Neon Postgres)
- (Optional) A **Resend** account for password reset emails

---

## Project Structure

```
appoinmenter/
├── backend/                  # Express API server
│   ├── src/
│   │   ├── config/           # Database connection (Prisma)
│   │   ├── controllers/      # Route handlers (auth, bookings, rooms)
│   │   ├── middleware/        # Auth middleware (JWT verification)
│   │   ├── routes/            # Express route definitions
│   │   ├── utils/             # Token generation, email service
│   │   └── server.js          # App entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── .env                   # Environment variables (not committed)
│
└── frontend/                 # Vue 3 SPA
    ├── src/
    │   ├── components/        # Reusable components (Navbar)
    │   ├── views/             # Page components
    │   ├── stores/            # Pinia stores (auth, bookings)
    │   ├── router/            # Vue Router config
    │   └── assets/            # Static assets (images, CSS)
    ├── index.html
    └── vite.config.js
```

---

## Quick Start

### 1. Clone and install dependencies

```bash
# From the appoinmenter/ directory

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

Copy the sample below into `backend/.env` and update with your values:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NODE_ENV="development"
JWT_SECRET="your-random-jwt-secret-here"
JWT_EXPIRES_IN="7d"
RESEND_API_KEY="re_..."           # Optional: for password reset emails
RESEND_FROM_EMAIL="onboarding@resend.dev"  # Optional: sender email
```

**Database:**
- The project uses PostgreSQL with Prisma ORM.
- Create a database and set `DATABASE_URL` to your connection string.
- Run the migration: `cd backend && npx prisma migrate dev`

### 3. Start the backend

```bash
cd backend
npm run dev
```

The server starts at **http://localhost:5000**.

### 4. Start the frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

The Vite dev server starts at **http://localhost:3002**.

---

## API Endpoints

All endpoints are prefixed with `http://localhost:5000`.

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Create account | No |
| POST | `/auth/login` | Sign in | No |
| POST | `/auth/logout` | Sign out | No |
| POST | `/auth/forgot-password` | Request password reset email | No |
| POST | `/auth/reset-password/:token` | Set new password with reset token | No |

### Bookings (all require auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings/get-future-booking` | Get upcoming bookings |
| GET | `/bookings/get-past-booking` | Get past bookings |
| POST | `/bookings/create-booking` | Create a new booking |
| PUT | `/bookings/update-booking?id=...` | Update a booking (reschedule) |
| DELETE | `/bookings/delete-booking?id=...` | Cancel a booking |

### Meeting Rooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetingrooms` | List all rooms |

---

## Features

- **User registration & login** — JWT-based authentication (token stored in localStorage)
- **Book meeting rooms** — Select room, date, time (15 min - 4 hour duration)
- **View upcoming bookings** — See and manage your scheduled rooms
- **Edit / reschedule bookings** — Update time/date (max 5 reschedules per month)
- **Cancel bookings** — With late-cancellation flagging
- **Past bookings history** — View completed and cancelled bookings
- **Password reset** — Email-based reset via Resend (15-minute token expiry)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Pinia + Vue Router |
| Styling | Tailwind CSS v4 (Bauhaus-inspired design) |
| Backend | Express (v5) |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jsonwebtoken) |
| Email | Resend |

---
