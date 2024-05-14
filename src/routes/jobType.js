import express from 'express';
import { addJobType, getAllJobTypes } from '../controllers/jobTypes.js';

const router = express.Router()

router.get('/', getAllJobTypes)

router.post('/', addJobType)

export default router