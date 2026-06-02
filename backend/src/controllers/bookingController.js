import  prisma  from "../config/db.js";

const getFutureBookings = async (req, res) => {
    try {
        const now = new Date();

        const bookings = await prisma.booking.findMany({
            where: {
                user_id: req.user.id,
                start_time: {
                    gte: now, // Only fetch where start_time is Greater Than or Equal to right now
                }
            },
            orderBy: {
                start_time: 'asc' // 'asc' puts the soonest upcoming appointments at the top
            },
            include: {
                meetingroom: true 
            }
        });

        res.status(200).json({
            status: "Success",
            data: { bookings }
        });
    } catch (error) {
        console.error("Unable to get future bookings", error);
        res.status(500).json({ error: "Failed to fetch future appointments" });
    }
};

// ==========================================
// 1B. GET PREVIOUS BOOKINGS (History)
// ==========================================
const getPastBookings = async (req, res) => {
    try {
        const now = new Date();

        const bookings = await prisma.booking.findMany({
            where: {
                user_id: req.user.id,
                start_time: {
                    lt: now, // Only fetch where start_time is Less Than right now
                }
            },
            orderBy: {
                start_time: 'desc' // 'desc' puts the most recent past appointments at the top
            },
            include: {
                meetingroom: true 
            }
        });

        res.status(200).json({
            status: "Success",
            data: { bookings }
        });
    } catch (error) {
        console.error("Unable to get past bookings", error);
        res.status(500).json({ error: "Failed to fetch booking history" });
    }
};

const createBooking = async (req,res)=>{
    try{
    //what user sends to backend to make a booking
    const {meetingroom_id, start_time, end_time} = req.body;

    const start = new Date(start_time);
    const end = new Date(end_time);
    const now = new Date();

    if (start < now) {
        return res.status(400).json({ error: "Cannot book a meeting in the past" });
    };

    if (end <= start) {
        return res.status(400).json({ error: "End time must be after start time" });
    };

    //ensuring duration is between (15 minutes and 4 hours)
    const durationMs = end.getTime() - start.getTime();
    const durationMins = durationMs / (1000 * 60);
        
    if (durationMins < 15 || durationMins > 240) { // 240 mins = 4 hours
        return res.status(400).json({ error: "Booking duration must be between 15 minutes and 4 hours" });
    }

    // verifying if the room exists
    const isRoom = await prisma.MeetingRoom.findUnique({
        where: {
            id: meetingroom_id  
        }
    });

    if (!isRoom){
        return res.status(404).json({error: "Room not found"});
    }

    // --- NEW: OPTIMISTIC LOCKING & OVERLAP PREVENTION ---
    // To prevent double booking simultaneously, we use a Prisma Transaction.
    // It ensures the overlap check and the creation happen in isolation.
    const newBooking = await prisma.$transaction(async (tx) => {
        const existingBooking = await tx.booking.findFirst({
            where: {
                meetingroom_id: meetingroom_id,
                status: "ACTIVE",
                AND: [
                    { start_time: { lt: end } }, 
                    { end_time: { gt: start } },  
                ],
            }
        });

        if (existingBooking) {
            throw new Error("DOUBLE_BOOKING");
        }

        return await tx.booking.create({
            data: {
                user_id: req.user.id,
                meetingroom_id: meetingroom_id,
                start_time: start,
                end_time: end,
                version: 1 // Initializing version for future updates
            }
        });
    });

    res.status(201).json({
        status: "Success",
        data: { booking: newBooking },
    });

    } catch (error) {
        if (error.message === "DOUBLE_BOOKING") {
            return res.status(409).json({ error: "This room was just booked by someone else. Please choose another time." });
        }
        console.error("Error during booking appointment", error);
        res.status(500).json({ error: "Failed to create booking" });
    }
};

const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id; // Removed quotes
        const { start_time, end_time, status, version } = req.body; // Expect version from frontend

        const existingBooking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!existingBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        if (existingBooking.user_id !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to update this booking" });
        }

        // --- NEW: MAX 5 RESCHEDULES LOGIC ---
        if (start_time && end_time) {
            const user = await prisma.user.findUnique({ where: { id: req.user.id } });
            
            const currentMonth = new Date().getMonth();
            const lastRescheduleMonth = user.last_reschedule_date ? new Date(user.last_reschedule_date).getMonth() : null;
            
            let currentRescheduleCount = user.reschedule_count;

            // Reset count if we are in a new month
            if (lastRescheduleMonth !== currentMonth) {
                currentRescheduleCount = 0;
            }

            if (currentRescheduleCount >= 5) {
                return res.status(429).json({ error: "You have reached the maximum of 5 reschedules this month." });
            }

            // Standard overlap and time checks
            const start = new Date(start_time);
            const end = new Date(end_time);
            const now = new Date();

            if (start < now) {
                return res.status(400).json({ error: "Cannot reschedule to a past time" });
            }
            if (end <= start) {
                return res.status(400).json({ error: "End time must be after start time" });
            }

            const overlapBookings = await prisma.booking.findFirst({
                where: {
                    meetingroom_id: existingBooking.meetingroom_id,
                    status: "ACTIVE",
                    id: { not: bookingId },
                    AND: [
                        { start_time: { lt: end } },
                        { end_time: { gt: start } },
                    ],
                }
            });

            if (overlapBookings) {
                return res.status(400).json({ error: "This room has already been booked during this time" });
            }

            // Increment the user's reschedule count
            await prisma.user.update({
                where: { id: req.user.id },
                data: {
                    reschedule_count: currentRescheduleCount + 1,
                    last_reschedule_date: new Date()
                }
            });
        }

        // --- OPTIMISTIC LOCKING ON UPDATE ---
        // Verify the version sent by the client matches the DB to prevent concurrent overwrites
        if (version && existingBooking.version !== version) {
             return res.status(409).json({ error: "This booking was modified by another process. Please refresh and try again." });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                ...(start_time && { start_time: new Date(start_time) }),
                ...(end_time && { end_time: new Date(end_time) }),
                ...(status && { status }),
                version: { increment: 1 } 
            },
            include: { meetingroom: true }
        });

        res.status(200).json({
            status: "Success",
            data: { booking: updatedBooking },
        });

    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ error: "Failed to update booking" });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id; // Get ID from URL parameter
        const now = new Date();

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        
        if (booking.user_id !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to cancel this booking" });
        }

        if (booking.start_time <= now) {
            return res.status(400).json({ error: "Cannot cancel a meeting that has already started or passed." });
        }

        // --- NEW: LAST MINUTE CANCELLATION FLAG ---
        const timeDifferenceMs = booking.start_time.getTime() - now.getTime();
        const timeDifferenceMins = timeDifferenceMs / (1000 * 60);

        if (timeDifferenceMins <= 15) {
            // Increment the user's flag score for last minute cancellation
            await prisma.user.update({
                where: { id: req.user.id },
                data: { flag_count: { increment: 1 } }
            });
        }

        // Instead of hard-deleting the row, it is better for history to mark it as CANCELLED.
        // If you strictly want to delete the row, change this to prisma.booking.delete(...)
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" }
        });

        res.status(200).json({
            status: "success",
            message: timeDifferenceMins <= 15 
                ? "Booking cancelled. Note: A flag was added to your account for late cancellation." 
                : "Booking successfully cancelled",
        });

    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Failed to delete booking" });
    }
};

export {getFutureBookings, getPastBookings, createBooking, updateBooking, deleteBooking};

