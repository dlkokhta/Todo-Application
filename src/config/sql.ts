import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined;


dotenv.config();

const pool = new Pool({
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: port,
});
console.log('Password type:', typeof process.env.PGPASSWORD)
pool.connect()
  .then(() => {
    console.log("Connected to the database successfully.");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

export default pool;