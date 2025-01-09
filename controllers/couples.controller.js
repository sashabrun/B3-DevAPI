import { getAll, getById, deleteById, create } from '../services/couples.service.js'
import prisma from "../db.js";

/**
 * Get all couples
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getCouples = async (req, res) => {
    try {
        const data = await getAll(req.query.sortBy, req.query.sortDir);
        return res.json({
            success: true,
            data
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching couples',
            error: err.message
        });
    }
}

/**
 * Get a couple by ID
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getCoupleById = async (req, res) => {
    try {
        const couple = await getById(parseInt(req.params.id));

        if (!couple) {
            return res.status(404).json({
                success: false,
                message: 'Couple not found'
            });
        }

        return res.json({
            success: true,
            data: couple
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the couple',
            error: err.message
        });
    }
}

/**
 * Delete a couple by ID
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const deleteCoupleById = async (req, res) => {
    try {
        const coupleId = parseInt(req.params.id);

        if (user1_id != req.user?.id || user2_id != req.user?.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this couple'
            });
        }

        const hasBeenDeleted = await deleteById(coupleId);
        if (!hasBeenDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Couple not found'
            });
        }

        return res.json({
            success: true,
            message: 'Couple deleted'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the couple',
            error: err.message
        });
    }
}

/**
 * Create a couple
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export const createCouple = async (req, res, next) => {
    const { user1_id, user2_id } = req.body;

    try {
        if (!user1_id || !user2_id) {
            return res.status(400).json({
                success: false,
                message: 'User IDs for both users are required to create a couple'
            });
        }

        const user1InCouple = await prisma.couple.findFirst({
            where: {
                OR: [
                    { user1_id: user1_id },
                    { user2_id: user1_id }
                ]
            }
        });

        const user2InCouple = await prisma.couple.findFirst({
            where: {
                OR: [
                    { user1_id: user2_id },
                    { user2_id: user2_id }
                ]
            }
        });

        if (user1InCouple) {
            return res.status(400).json({
                success: false,
                message: `First user is already in a couple with another user`
            });
        }

        if (user2InCouple) {
            return res.status(400).json({
                success: false,
                message: `Second user is already in a couple with another user`
            });
        }

        const couple = await create(user1_id, user2_id);

        return res.json({
            success: true,
            data: couple
        });
    } catch (err) {
        return next(err);
    }
}
