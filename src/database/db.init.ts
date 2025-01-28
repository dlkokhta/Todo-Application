import pool from '../config/sql';



const createUsersTableIfNotExist = async () => {
    const userQuery = `
       CREATE TABLE IF NOT EXISTS users (
        
        name VARCHAR(255) NOT NULL,
        
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
       
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(userQuery);
      console.log("User table checked/created successfully");
    } catch (error) {
      console.error("Error creating users table:", error);
    }
  };
  

export const initDatabase = async () => {
  await createUsersTableIfNotExist();
  
};