const connectionString = `${process.env.DATABASE_URL}`;
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;


const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB Connected via Prisma");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export  {connectDB, disconnectDB};
export default prisma;
