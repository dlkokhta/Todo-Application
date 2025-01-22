import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./database/db.init";

dotenv.config();

const app = express();

app.use(bodyParser.json()); 
app.use(cors());



const PORT = process.env.PORT || 3001;


(async () => {
  try {
    await initDatabase();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    process.exit(1);  
  }
  app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
  });
})();

export default app;