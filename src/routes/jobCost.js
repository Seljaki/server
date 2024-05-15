import express from 'express';
import { getAllJobCostsExpress } from '../controllers/jobCost.js';

const router = express.Router({mergeParams: true})

router.get('/', getAllJobCostsExpress)

export default router