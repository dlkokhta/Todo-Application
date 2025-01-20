import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const port = process.env.SQL_PORT ? parseInt(process.env.SQL_PORT, 10) : undefined;

const pool = new Pool({
  database: process.env.SQL_DATABASE,
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  port: port,
});

pool.connect()
  .then(() => {
    console.log("Connected to the database successfully.");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

export default pool;