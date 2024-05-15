import express from 'express';
import { deleteJobPlot, getAllPlotsForJob, insertJobPlot } from '../controllers/jobsPlots.js';

const router = express.Router({mergeParams: true})

router.get('/', getAllPlotsForJob)

router.post('/:plotId', insertJobPlot)

router.delete('/:plotId', deleteJobPlot)

export default router