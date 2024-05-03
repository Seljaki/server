import express from 'express';
import { login } from '../controllers/auth.js';
import { requiresLogin } from '../middleware/authChecker.js';

const router = express.Router()

router.get('/test', requiresLogin, (req, res) => {
  res.status(200).json('works')
})

router.post('/login', login)
export default router