import { getRandomCountry } from '../services/randomCountry.service.js';

/**
 * Get a random country based on user preferences
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function getRandomCountryHandler(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const country = await getRandomCountry(userId);
        res.status(200).json({ country });
    } catch (error) {
        if (error.message === 'User preferences not found' || error.message === 'No eligible countries found') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
}