import express from 'express';
import {getAllEquipmentForJob, insertJobEquipment, deleteJobEquipment} from "../routes/jobsEquipment.js";

const router = express.Router({mergeParams: true})

router.get('/', getAllEquipmentForJob)

router.post('/:equipmentId', insertJobEquipment)

router.delete('/:equipmentId', deleteJobEquipment);
export default router