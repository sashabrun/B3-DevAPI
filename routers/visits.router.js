import express from 'express'
import { getVisits, getVisitById, deleteVisitById, createVisit, updateVisitById } from '../controllers/visits.controller.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

/**
 * Visits routes
 */
router.get('/', authMiddleware, getVisits)
router.get('/:id', authMiddleware, getVisitById)
router.delete('/:id', authMiddleware, deleteVisitById)
router.post('/', authMiddleware, createVisit)
router.put('/:id', authMiddleware, updateVisitById)

export default router