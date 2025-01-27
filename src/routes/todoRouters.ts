import express from "express";
const todoRouters = express.Router();
import userRegistrationController from "../controllers/userRegistrationController.js"




todoRouters.post("/register", userRegistrationController);


export default todoRouters;