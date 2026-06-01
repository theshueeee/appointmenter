import  prisma  from "../config/db.js";

const getBookings = async (req,res)=>{
    const bookings = await prisma.booking.findMany({
        where:{
            user_id: "req.user.id",
        }
    });

    try{
        res.status(200).json({
            status: "Success",
            data:{bookings}
        });
    } catch (error) {
        console.log("Unable to get bookings", error);
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

    // verifying if the room exists
    const isRoom = await prisma.MeetingRoom.findUnique({
        where: {
            id: meetingroom_id  
        }
    });

    if (!isRoom){
        return res.status(404).json({error: "Room not found"});
    }

    //check if booking is already
    const existingBooking = await prisma.booking.findFirst({
        where: {
            meetingroom_id: meetingroom_id,
            status: "ACTIVE",
            AND: [
            { start_time: { lt: end } }, // Existing meeting starts before the new one ends
            { end_time: { gt: start } },  // Existing meeting ends after the new one starts
            ],
        }
    });

    if (existingBooking){
        return res.status(400).json({error: "This room has already been booked during this time"});
    };

    const booking = await prisma.booking.create({
        data:{
            user_id: "req.user.id",
            meetingroom_id : meetingroom_id,
            start_time : start_time,
            end_time: end_time,
        }
    });

    
        res.status(201).json({
        status:"Success",
        data:{
            booking,
        },
        });
    } catch (error){
        console.log("Error during booking appointment", error)
        res.status(500).json({ error: "Failed to create booking" });
    };
};

const updateBooking = async (req, res) => {
    try {
        // 1. Grab the booking ID from the URL (e.g., PUT /api/bookings/:id)
        const bookingId = "req.params.id"; 
        
        const { start_time, end_time, status } = req.body;

        // --- VERIFY EXISTENCE & AUTHORIZATION ---
        const existingBookings = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!existingBookings) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Security check: Prevent users from updating other people's bookings
        if (existingBookings.user_id !== "req.user.id") {
            return res.status(403).json({ error: "You are not authorized to update this booking" });
        }

        // --- TIME VALIDATION & OVERLAP LOGIC ---
        // Only run this check if the user is actually trying to change the time
        if (start_time && end_time) {
            const start = new Date(start_time);
            const end = new Date(end_time);
            const now = new Date();

            if (start < now) {
                return res.status(400).json({ error: "Cannot reschedule to a past time" });
            }
            if (end <= start) {
                return res.status(400).json({ error: "End time must be after start time" });
            }

            // Overlap check
            const overlapBookings = await prisma.booking.findFirst({
                where: {
                    meetingroom_id: existingBookings.meetingroom_id,
                    status: "ACTIVE",
                    id: { not: bookingId },
                    AND: [
                    { start_time: { lt: end } }, // Existing meeting starts before the new one ends
                    { end_time: { gt: start } },  // Existing meeting ends after the new one starts
                    ],
                }
            });

            if (overlapBookings){
                return res.status(400).json({error: "This room has already been booked during this time"});
            };
        }

        // --- EXECUTE THE UPDATE ---
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                // The spread syntax (...) ensures we only update fields the user actually sent
                ...(start_time && { start_time }),
                ...(end_time && { end_time }),
                ...(status && { status }),
                
                // Bonus: Because you have a 'version' field in your schema, 
                // it is best practice to increment it every time a change is made!
                version: { increment: 1 } 
            },
            include: { meetingroom: true }
        });

        res.status(200).json({
            status: "Success",
            data: {
                booking: updatedBooking,
            },
        });

    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ error: "Failed to update booking" });
    }
};

const deleteBooking = async (req,res)=>{
    try{
    const tempId = "8f1b8ae2-29af-417e-8603-b8b5609662dc";
    const booking = await prisma.booking.findUnique({
        where: {
            id:tempId
        },
    });

    if (!booking){
        res.status(404).json({error: "Booking not found"})
    };

    await prisma.booking.delete({
        where: { id: tempId },
  });

  res.status(200).json({
    status: "success",
    message: "Booking removed",
  });

    } catch(error){
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Failed to delete booking" });
    }
};

export {getBookings, createBooking, updateBooking, deleteBooking};

