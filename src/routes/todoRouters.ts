import express from "express";
const todoRouters = express.Router();
import userRegistration from "../controllers/userRegistration.js"




todoRouters.post("/register", userRegistration);


export default todoRouters;