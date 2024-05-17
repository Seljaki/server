import express from 'express';
import {addService, deleteService, listAllServices, serviceById, updateService} from "../controllers/service.js";

const router = express.Router()

router.get('/:serviceId', serviceById)
router.get('/', listAllServices);

router.post('/', addService)

router.delete('/:serviceId', deleteService)

router.put('/:serviceId', updateService)
export default router