import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userRegistrationSchema from "schemas/userRegistrationSchema"; // Validation schema
import { newUserTypes } from "types/newUserTypes";
import CryptoJS from "crypto-js";
// import { sensitiveHeaders } from "../email/edge.js"; // For sending verification emails
import pool from "../config/sql"; // PostgreSQL pool for database queries
import { v4 as uuidv4 } from 'uuid';

const userRegistrationController = async (req: Request, res: Response) => {
  try {
    const userData: newUserTypes = req.body;
    console.log("userDataaa", req.body);

    const userId = uuidv4();

    let client = await pool.connect();

    const result = await client.query({
      text: "INSERT INTO users ( name, email, password ) VALUES ($1, $2, $3) RETURNING *",
      values: [
        
        userData.name,
        userData.email,
        userData.password
      ],
    });
    res.send({ message: "Car added successfully", users: result.rows[0] });
   
     
  } catch (error) {
    console.error("Error in registration process:", error);
    return res.status(500).json({
      error: "An error occurred during registration. Please try again later.",
    });
  }
};

export default userRegistrationController;
