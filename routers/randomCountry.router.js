import express from 'express';
import { getRandomCountryHandler } from '../controllers/randomCountry.controller.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getRandomCountryHandler);

export default router;