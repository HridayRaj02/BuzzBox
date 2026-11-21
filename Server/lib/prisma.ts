// Shared Prisma client. Development reuses one instance during file-watch restarts.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const connectionUrl = new URL(process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/buzzbox");
if (process.env.BUZZBOX_DATABASE_NAME) connectionUrl.pathname = `/${process.env.BUZZBOX_DATABASE_NAME}`;
const adapter = new PrismaPg({ connectionString: connectionUrl.toString() });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
