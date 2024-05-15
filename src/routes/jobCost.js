import express from 'express';
import { addJobCostToJob, deleteJobCost, getAllJobCostsExpress, getJobCostByIdExpress, updateJobCost } from '../controllers/jobCost.js';

const router = express.Router({mergeParams: true})

router.get('/:jobCostId', getJobCostByIdExpress)
router.get('/', getAllJobCostsExpress)

router.post('/', addJobCostToJob)

router.put('/:jobCostId', updateJobCost)

router.delete('/:jobCostId', deleteJobCost)

export default router