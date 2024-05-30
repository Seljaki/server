import express from 'express';
import { getAllGeneralStatistics } from '../controllers/statistics.js';

const router = express.Router()

router.get('/', getAllGeneralStatistics)


export default router