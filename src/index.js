// src/index.js
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import plotsRoutes from './routes/plot.js'
import companiesRoutes from './routes/company.js'
import servicesRoutes from './routes/service.js'
import equipmentRoutes from './routes/equipment.js'
import jobTypeRoutes from './routes/jobType.js'
import invoicesRoutes from './routes/invoice.js'
import morgan from "morgan";
import { requiresLogin } from "./middleware/authChecker.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

// Routes
app.use('/auth', authRoutes)
app.use(requiresLogin)
app.use('/users', userRoutes)
app.use('/plots', plotsRoutes)
app.use('/companies', companiesRoutes)
app.use('/equipment', equipmentRoutes)
app.use('/services', servicesRoutes)
app.use('/jobTypes', jobTypeRoutes)
app.use('/invoices', invoicesRoutes)

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  /*try {
    await createUser('admin', 'admin', null)
  } catch (error) {

  }*/
});