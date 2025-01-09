import { getAll, getById, deleteById, create, updateById } from '../services/countries.service.js';
/**
 * Get all countries
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCountries = async (req, res) => {
    try {
        const data = await getAll(req.query.sortBy, req.query.sortDir);
        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch countries",
        });
    }
};

/**
 * Get a country by ID
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getCountryById = async (req, res) => {
    try {
        const countryId = parseInt(req.params.id);
        if (isNaN(countryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid country ID",
            });
        }

        const country = await getById(countryId);
        if (!country) {
            return res.status(404).json({
                success: false,
                message: "Country not found",
            });
        }
        return res.json({
            success: true,
            data: country,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch country",
        });
    }
};

/**
 * Delete a country by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const deleteCountryById = async (req, res) => {
    try {
        const countryId = parseInt(req.params.id);
        if (isNaN(countryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid country ID",
            });
        }

        const hasBeenDeleted = await deleteById(countryId);
        if (!hasBeenDeleted) {
            return res.status(404).json({
                success: false,
                message: "Country not found",
            });
        }

        return res.json({
            success: true,
            message: "Country deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete country",
        });
    }
};

/**
 * Update a country by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const updateCountryById = async (req, res) => {
    try {
        const countryId = parseInt(req.params.id);
        if (isNaN(countryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid country ID",
            });
        }

        const { name, continent, temperature, is_open } = req.body;

        const country = await updateById(countryId, { name, continent, temperature, is_open });
        if (!country) {
            return res.status(404).json({
                success: false,
                message: "Country not found",
            });
        }

        return res.json({
            success: true,
            data: country,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update country",
        });
    }
};

/**
 * Create a new country
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const createCountry = async (req, res) => {
    const { name, continent, temperature, is_open } = req.body;

    if (!name || !continent ) {
        return res.status(400).json({
            success: false,
            message: "Name and continent are required",
        });
    }

    try {
        const country = await create(name, continent, temperature, is_open);
        res.json({
            success: true,
            data: country,
        });
    } catch (error) {
        if (error.message === "Name already exists") {
            return res.status(400).json({
                success: false,
                message: "Country name already exists",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create country",
        });
    }
};
