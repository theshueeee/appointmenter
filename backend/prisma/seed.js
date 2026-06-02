import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const meetingRooms = [
  { name: "Conference Room A", location: "3rd Floor - East Wing", status: "AVAILABLE" },
  { name: "Conference Room B", location: "3rd Floor - West Wing", status: "AVAILABLE" },
  { name: "Board Room", location: "2nd Floor - North Side", status: "AVAILABLE" },
  { name: "Huddle Space 1", location: "1st Floor - Lobby Area", status: "AVAILABLE" },
  { name: "Huddle Space 2", location: "1st Floor - Back Corridor", status: "AVAILABLE" },
  { name: "Training Room", location: "2nd Floor - South Side", status: "AVAILABLE" },
  { name: "Executive Suite", location: "4th Floor - Penthouse", status: "AVAILABLE" },
  { name: "Focus Room", location: "1st Floor - Quiet Zone", status: "AVAILABLE" },
  { name: "Meeting Pod 1", location: "2nd Floor - Open Area", status: "AVAILABLE" },
  { name: "Meeting Pod 2", location: "3rd Floor - Open Area", status: "MAINTENANCE" },
];

async function main() {
  console.log("Seeding meeting rooms...");

  // Delete existing bookings first, then rooms (foreign key constraint)
  await prisma.booking.deleteMany();
  await prisma.meetingRoom.deleteMany();

  for (const room of meetingRooms) {
    const created = await prisma.meetingRoom.create({
      data: room,
    });
    console.log(`  Created: ${created.name} (${created.location}) - ${created.status}`);
  }

  console.log(`\nSeeded ${meetingRooms.length} meeting rooms successfully.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });