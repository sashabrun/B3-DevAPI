import prisma from '../db.js'

/**
 * Get all visits
 * @param sortBy
 * @param sortDirection
 * @returns {Promise<*>}
 */
export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            user_id: true,
            country_id: true,
            date: true,
            rating: true,
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return prisma.visit.findMany(options);
}

/**
 * Get a visit by ID
 * @param id
 * @returns {Promise<*>}
 */
export const getById = async (id) => {
    return prisma.visit.findUnique({
        select: {
            id: true,
            user_id: true,
            country_id: true,
            date: true,
            rating: true,
        },
        where: {
            id
        }
    });
}

/**
 * Delete a visit by ID
 * @param id
 * @returns {Promise<boolean>}
 */
export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.visit.delete({
            where: {
                id
            }
        })
        return true
    }
    return false
}

/**
 * Update a visit by ID
 * @param id
 * @param data
 * @returns {Promise<*>}
 */
export const updateById = async (id, data) => {
    const visit = await prisma.visit.update({
        where: {
            id
        },
        data: {
            user_id: data.user_id,
            country_id: data.country_id,
            date: data.date,
            rating: data.rating
        },
        select: {
            id: true,
            user_id: true,
            country_id: true,
            date: true,
            rating: true,
        }
    })

    return visit
}

/**
 * Create a new visit
 * @param user_id
 * @param country_id
 * @param date
 * @param rating
 * @returns {Promise<*>}
 */
export const create = async (user_id, country_id, date, rating) => {
    const visit = await prisma.visit.create({
        data: {
            user_id,
            country_id,
            date,
            rating
        },
        select: {
            id: true,
            user_id: true,
            country_id: true,
            date: true,
            rating: true,
        }
    })

    return visit
}