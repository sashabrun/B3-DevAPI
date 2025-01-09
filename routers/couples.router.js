import express from 'express'
import {getCouples, getCoupleById, deleteCoupleById, createCouple} from '../controllers/couples.controller.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

/**
 * Couples routes
 */
router.get('/', authMiddleware, getCouples)
router.get('/:id', authMiddleware, getCoupleById)
router.delete('/:id', authMiddleware, deleteCoupleById)
router.post('/', authMiddleware, createCouple)

export default router