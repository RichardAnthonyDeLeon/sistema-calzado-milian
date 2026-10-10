import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,

  connectionLimit: 10,
  connectTimeout: 10000,
  acquireTimeout: 20000,
  idleTimeout: 300,
});

export const prisma = new PrismaClient({
  adapter,
});