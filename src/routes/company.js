import express from 'express';
import { addCompany, companyById, deleteCompany, getCompanyDefaultIssuer, listAllCompanies, updateCompany } from '../controllers/company.js';

const router = express.Router()

router.get('/defaultIssuer', getCompanyDefaultIssuer)
router.get('/:companyId', companyById)
router.get('/', listAllCompanies)

router.post('/', addCompany)

router.delete('/:companyId', deleteCompany)

router.put('/:companyId', updateCompany)

export default router