import express from 'express';
import { addJobType, getAllJobTypes, getAllQuantityTypes, updateJobType } from '../controllers/jobTypes.js';

const router = express.Router()

router.get('/', getAllJobTypes)
router.get('/quantityTypes', getAllQuantityTypes)

router.post('/', addJobType)

router.put('/:jobTypeId', updateJobType)

export default router