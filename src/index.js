// src/index.js
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import plotsRoutes from './routes/plot.js'
import morgan from "morgan";
import { createUser } from "./utils/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

// Routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/plots', plotsRoutes)

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  /*try {
    await createUser('admin', 'admin', null)
  } catch (error) {

  }*/
});