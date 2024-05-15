import express from 'express';
import { addJobToInvoice, getAllJobsForInvoice } from '../controllers/jobs.js';

const router = express.Router({mergeParams: true})

router.get('/', getAllJobsForInvoice)

router.post('/', addJobToInvoice)

export default router