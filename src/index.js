// src/index.js
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import userRoutes from './routes/user.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

app.use('/user', userRoutes)

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});