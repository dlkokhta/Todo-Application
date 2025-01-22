import pool from '../config/sql';

const userRegistrationTable = async () => {
  const userTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      firstname VARCHAR(255) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;``
      
  try {
    await pool.query(userTableQuery);
    console.log("User table checked/created successfully.");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};


export const initDatabase = async () => {
  await userRegistrationTable(); // Create table
};
