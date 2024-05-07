import express from 'express';
import { requiresLogin } from '../middleware/authChecker.js';
import { addUser, deleteUser, listAllUsers, updateUser } from '../controllers/user.js';

const router = express.Router()

router.get('/', requiresLogin, listAllUsers)

router.post('/', requiresLogin, addUser)

//router.put('/:userId', requiresLogin, updateUser)
router.put('/', requiresLogin, updateUser)

//router.delete('/:userId', requiresLogin, deleteUser)
router.delete('/', requiresLogin, deleteUser)

export default router