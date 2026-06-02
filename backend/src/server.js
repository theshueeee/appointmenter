import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config"; 
import { connectDB, disconnectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import meetingroomRoutes from "./routes/meetingroomRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Connect Database
connectDB();

// 2. Apply Middleware
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 3. Define API Routes
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/meetingrooms", meetingroomRoutes)

// 4. Start Server (Save server instance to a variable for graceful shutdown)
const server = app.listen(PORT, () => {
  console.log(`The Server is running on port ${PORT}`);
});

// --- Error Handling & Shutdown below ---
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});