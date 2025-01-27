import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userRegistrationSchema from "schemas/userRegistrationSchema"; // Validation schema
import { newUserTypes } from "types/newUserTypes";
import CryptoJS from "crypto-js";
// import { sensitiveHeaders } from "../email/edge.js"; // For sending verification emails
import pool from "../config/sql"; // PostgreSQL pool for database queries

const userRegistrationController = async (req: Request, res: Response) => {
  try {
    const userData: newUserTypes = req.body;
    console.log("userDataaa", req.body);

    // Validate incoming user data
    const validator = await userRegistrationSchema(userData);
    const { value, error } = validator.validate(userData);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, role } = value;

    // Check if the email already exists in the database
    const emailCheckQuery = "SELECT email FROM users WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const insertUserQuery = `
      INSERT INTO users (firstname, email, password, role, is_verified)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, firstname, email;
    `;
    const newUserResult = await pool.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      role,
      false, // User is not verified initially
    ]);

    // const newUser = newUserResult.rows[0];

    // Generate a random string for email verification
    const randomString = CryptoJS.lib.WordArray.random(32).toString(
      CryptoJS.enc.Hex
    );

    // Save verification data to the database
    const insertVerificationQuery = `
      INSERT INTO user_verifications (email, random_string)
      VALUES ($1, $2);
    `;
    await pool.query(insertVerificationQuery, [email, randomString]);

    // Construct the email verification URL
    // const url = "";
    // const verificationLink = `${url}/verify?param=${randomString}`;

    // Send verification email
    // await sensitiveHeaders(newUser.email, newUser.firstname, verificationLink);

    return res.status(201).json({
      message: "User registered. Please verify your email.",
    });
  } catch (error) {
    console.error("Error in registration process:", error);
    return res.status(500).json({
      error: "An error occurred during registration. Please try again later.",
    });
  }
};

export default userRegistrationController;
