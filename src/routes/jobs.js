import express from 'express';
import jobCostRoutes from './jobCost.js'
import jobPlotsRoutes from './jobsPlots.js'
import { addJobToInvoice, deleteJob, getAllJobsForInvoice, getjobById, updateJob } from '../controllers/jobs.js';

const router = express.Router({mergeParams: true})

router.get('/:jobId', getjobById)
router.get('/', getAllJobsForInvoice)

router.post('/', addJobToInvoice)

router.delete('/:jobId', deleteJob)

router.put('/:jobId', updateJob)

router.use('/:jobId/jobCosts', jobCostRoutes)
router.use('/:jobId/plots', jobPlotsRoutes)

export default router