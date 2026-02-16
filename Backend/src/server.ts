import app from "./app";
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from "./database/connection";

const start = async () => {
  await connectDB();

  app.listen(3001, () => {
    console.log("Server running on port 5000");
  });
};

start();
