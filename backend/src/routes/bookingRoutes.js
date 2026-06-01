import express from "express";
import {createBooking, deleteBooking, getBookings, updateBooking} from "../controllers/bookingController.js";        

const router = express.Router();

router.post("/create-booking", createBooking);
router.get("/get-booking", getBookings);
router.put("/update-booking", updateBooking);
router.delete("/delete-booking", deleteBooking);

export default router;