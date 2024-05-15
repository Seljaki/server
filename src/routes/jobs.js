import express from 'express';
import { addJobToInvoice, deleteJob, getAllJobsForInvoice } from '../controllers/jobs.js';

const router = express.Router({mergeParams: true})

router.get('/', getAllJobsForInvoice)

router.post('/', addJobToInvoice)

router.delete('/:jobId', deleteJob)

export default router