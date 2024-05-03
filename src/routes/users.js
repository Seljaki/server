import express from 'express';
import { requiresLogin } from '../middleware/authChecker.js';
import { addUser, listAll } from '../controllers/user.js';

const router = express.Router()

router.get('/', requiresLogin, listAll)

router.post('/', requiresLogin, addUser)

export default router