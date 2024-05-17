import express from 'express';
import { addUser, deleteUser, listAllUsers, updateUser } from '../controllers/user.js';

const router = express.Router()

router.get('/', listAllUsers)

router.post('/', addUser)

router.put('/:userId', updateUser)
router.put('/', updateUser)

router.delete('/:userId', deleteUser)
router.delete('/', deleteUser)

export default router