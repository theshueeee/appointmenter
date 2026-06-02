import express from "express";
import {createBooking, deleteBooking, getFutureBookings, getPastBookings, updateBooking} from "../controllers/bookingController.js";        

const router = express.Router();

router.post("/create-booking", createBooking);
router.get("/get-future-booking", getFutureBookings);
router.get("/get-past-booking", getPastBookings);
router.put("/update-booking", updateBooking);
router.delete("/delete-booking", deleteBooking);

export default router;