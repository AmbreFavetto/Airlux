import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
const redis = new Redis({
  lazyConnect: true, 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  //db: process.env.DB_NAME,
  //connectionLimit: process.env.DB_CONNECTION_LIMIT
});

export default redis;
