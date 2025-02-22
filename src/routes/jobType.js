import express from 'express';
import {
  addJobType,
  deleteJobType,
  getAllJobTypes,
  getAllQuantityTypes,
  getJobTypeById,
  updateJobType
} from '../controllers/jobTypes.js';

const router = express.Router()

router.get('/:jobTypeId', getJobTypeById)
router.get('/', getAllJobTypes)
router.get('/quantityTypes', getAllQuantityTypes)

router.post('/', addJobType)

router.put('/:jobTypeId', updateJobType)

router.delete('/:jobTypeId', deleteJobType)

export default router