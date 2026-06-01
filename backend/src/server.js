import express from "express";
import cors from "cors";
import "dotenv/config"; 
import { connectDB, disconnectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();
const PORT = 5000;

// 1. Connect Database
connectDB();

// 2. Apply Middleware
//app.use(cors());
app.use(express.json());

// 3. Define API Routes
app.use("/auth", authRoutes);

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