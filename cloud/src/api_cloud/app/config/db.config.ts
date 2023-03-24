import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const pool: mysql.Pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "airlux_cloud_db",
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 20
});

export default pool;
