import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
const redis: Redis = new Redis({
  lazyConnect: true,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 8306,
  password: process.env.DB_PASSWORD || "letmein",
});

export default redis;
