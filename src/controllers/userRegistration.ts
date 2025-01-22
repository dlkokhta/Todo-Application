import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userRegistrationSchema from "schemas/userRegistrationSchema";
import { newUserTypes } from "types/newUserTypes";
import CryptoJS from "crypto-js";
import userverifyModel from "models/userVerifyModel";
import { sensitiveHeaders } from "../email/edge.js";


const userRegistrationController = async (req: Request, res: Response) => {
  try {
    const userData: newUserTypes = req.body;

    const validator = await userRegistrationSchema(userData);

    const { value, error } = validator.validate(userData);

    if (error) {
      return res.status(400).send("Email already exist");
    }

    const { name, email, role } = value;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new userRegistrationModel({
      name: name,
      email: email,
      password: hashedPassword,
      role,
      userVerified: false,
    });
    newUser.save();

    const randomString = CryptoJS.lib.WordArray.random(32).toString(
      CryptoJS.enc.Hex
    );

    const userVerify = new userverifyModel({
      email: email,
      randomString: randomString,
    });

    userVerify.save();

    return res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (error) {
    console.error("Error in registration process:", error);
    return res.status(500).json({
      error: "An error occurred during registration. Please try again later.",
    });
  }
};

export default userRegistrationController;
