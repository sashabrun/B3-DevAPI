import { getAll, getById, deleteById, create, updateById } from '../services/visits.service.js'

/**
 * Get all visits
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getVisits = async (req, res) => {
    try {
        const data = await getAll(req.query.sortBy, req.query.sortDir)
        if (!data.length) {
            return res.status(404).json({
                success: false,
                message: 'No visits found'
            })
        }
        res.json({
            success: true,
            data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve visits'
        })
    }
}

/**
 * Get visit by ID
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getVisitById = async (req, res) => {
    try {
        if (isNaN(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid visit ID'
            })
        }

        const visit = await getById(parseInt(req.params.id))
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit not found'
            })
        }
        return res.json({
            success: true,
            data: visit
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving visit'
        })
    }
}

/**
 * Delete visit by ID
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const deleteVisitById = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        if (!id || id < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid visit ID'
            })
        }

        const hasBeenDeleted = await deleteById(id)
        if (!hasBeenDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Visit not found'
            })
        }

        return res.json({
            success: true,
            message: 'Visit deleted'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting visit'
        })
    }
}

/**
 * Update visit by ID
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const updateVisitById = async (req, res) => {
    const { user_id, date, rating, country_id } = req.body;

    try {
        if (user_id) {
            return res.status(400).json({
                success: false,
                message: "Modification of user ID is not allowed"
            });
        }

        if (rating !== undefined && (rating < 0 || rating > 10)) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 0 and 10"
            });
        }

        if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Date must be in the format YYYY-MM-DD"
            });
        }

        if (country_id !== undefined && (!country_id || isNaN(country_id))) {
            return res.status(400).json({
                success: false,
                message: "Valid country ID is required"
            });
        }

        const visit = await updateById(parseInt(req.params.id), { date, rating, country_id });
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });
        }

        return res.json({
            success: true,
            data: visit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating visit"
        });
    }
};

/**
 * Create a new visit
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export const createVisit = async (req, res, next) => {
    const user_id = req.user?.id;
    const { country_id, date, rating } = req.body;

    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    if (!country_id || isNaN(country_id)) {
        return res.status(400).json({
            success: false,
            message: "Valid country ID is required"
        });
    }

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
            success: false,
            message: "Date must be in the format YYYY-MM-DD"
        });
    }

    if (rating !== undefined && (rating < 0 || rating > 10)) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 0 and 10"
        });
    }

    try {
        const visit = await create(user_id, country_id, date, rating);
        res.json({
            success: true,
            data: visit
        });
    } catch (err) {
        if (err.code === "P2003") {
            return res.status(400).json({
                success: false,
                message: "Invalid country ID"
            });
        }
        return next(err);
    }
};
