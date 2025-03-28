import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userRegistrationSchema from "schemas/userRegistrationSchema"; 
import { UserRegistrationTypes } from "types/userRegistrationTypes";
// import CryptoJS from "crypto-js";
// import { sensitiveHeaders } from "../email/edge.js"; // For sending verification emails
import pool from "../config/sql"; // PostgreSQL pool for database queries
import { v4 as uuidv4 } from 'uuid';

const userRegistrationController = async (req: Request, res: Response) => {
  try {
    const userData: UserRegistrationTypes = req.body;
    const client = await pool.connect();

    const emailCheckQuery = "SELECT email FROM users WHERE email = $1";
    const result = await client.query(emailCheckQuery, [userData.email]);

    if (result.rows.length > 0) {
      client.release(); // Release DB connection
      return res.status(400).send({ message: "Email already exists" });
    }

    const { value, error } = userRegistrationSchema.validate(userData);

    if (error) {
      client.release();
      return res.status(400).send({ message: error.details[0].message });
    }

    const { name, email, password } = value;

    console.log("userDataaa", req.body);


    const userId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    

    const newUser = {
      id: userId,
      name:name,
      email:email,
      password:hashedPassword,
      isVerified: false 
    };
      
    const insertResult = await client.query(
      'INSERT INTO users (id, name, email, password, isVerified) VALUES ($1, $2, $3, $4, $5)',
      [newUser.id, newUser.name, newUser.email, newUser.password,  newUser.isVerified]
    );
     
    client.release(); // **Release database connection after successful insert**
    res.send({ message: "User added successfully",  users: insertResult.rows[0]});
   
     
  } catch (error) {
    console.error("Error in registration process:", error);
    return res.status(500).json({
      error: "An error occurred during registration. Please try again later.",
    });
  }
};

export default userRegistrationController;
