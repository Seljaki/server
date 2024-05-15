import express from 'express';
import { addPlot, deletePlot, getAllPlots, getAllPlotsAsGeoJson, getPlotById, updatePlot } from '../controllers/plot.js';

const router = express.Router()

router.get('/geojson', getAllPlotsAsGeoJson)
router.get('/:plotId', getPlotById)
router.get('/', getAllPlots)

router.post('/', addPlot)

router.put('/:plotId', updatePlot)

router.delete('/:plotId', deletePlot)

export default router