import express from 'express';
import {
    addEquipment,
    equipmentById,
    updateEquipment,
    listAllEquipment,
    deleteEquipment
} from "../controllers/equipment.js";

const router = express.Router()

router.get('/:equipmentId', equipmentById)
router.get('/', listAllEquipment)

router.post('/', addEquipment)

router.delete('/:equipmentId', deleteEquipment)

router.put('/:equipmentId', updateEquipment)

export default router