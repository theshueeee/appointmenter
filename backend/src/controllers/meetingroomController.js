import prisma from "../config/db.js";

const getMeetingRooms = async (req,res) =>{
    try{
        const MeetingRooms = await prisma.meetingRoom.findMany();
    res.status(200).json({
        status: "Successful",
        data:{
            MeetingRooms,
        },
    })
    } catch(error){
        res.status(500).json({
            error: "Unable to fetch all meeting rooms"
        });
};
};

const getMeetingRoom = async (req, res) => {
  const MeetingRoom = await prisma.meetingRoom.findUnique({
    where: { id: "550e8400-e29b-41d4-a716-446655440000" },
  });

  if (!MeetingRoom) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.status(200).json({
    status: "Success",
    data: {
      MeetingRoom,
    },
  });
};    

export {getMeetingRoom, getMeetingRooms};


