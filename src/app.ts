import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json()); 
app.use(cors());



app.listen(process.env.PORT || 3000);