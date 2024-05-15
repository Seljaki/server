import express from 'express';
import jobsRouter from './jobs.js'
import { addInvoice, deleteInvoice, editInvoice, getAllInvoices, getInvoiceById } from '../controllers/invoice.js';

const router = express.Router()

router.get('/:invoiceId', getInvoiceById)
router.get('/', getAllInvoices)

router.post('/', addInvoice)

router.put('/:invoiceId', editInvoice)

router.delete('/:invoiceId', deleteInvoice)

router.use('/:invoiceId/jobs', jobsRouter)

export default router