import express from 'express'
import {
    getUsers,
    getUserById,
    deleteUserById,
    registerUser,
    loginUser,
    updateUserById,
    logoutUser
} from '../controllers/users.controller.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

/**
 * Users routes
 */
router.get('/', authMiddleware, getUsers)
router.get('/:id', authMiddleware, getUserById)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.delete('/logout', authMiddleware, logoutUser)
router.delete('/', authMiddleware, deleteUserById)
router.put('/', authMiddleware, updateUserById)


export default router