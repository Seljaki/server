import express from 'express';
import { requiresLogin } from '../middleware/authChecker.js';
import { addUser } from '../controllers/user.js';

const router = express.Router()

router.post('/', requiresLogin, addUser)

export default router