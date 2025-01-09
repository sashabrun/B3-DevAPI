import express from 'express'
import { getCountries, getCountryById, deleteCountryById, createCountry, updateCountryById } from '../controllers/countries.controller.js'
import authMiddleware, {isAdmin} from '../middlewares/auth.js'

const router = express.Router()

/**
 * Countries routes
 */
router.get('/', authMiddleware, getCountries)
router.get('/:id', authMiddleware, getCountryById)
router.delete('/:id', authMiddleware, isAdmin, deleteCountryById)
router.post('/', authMiddleware, isAdmin, createCountry)
router.put('/:id', authMiddleware, isAdmin, updateCountryById)

export default router