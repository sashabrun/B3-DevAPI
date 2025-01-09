import {getAll, getById, deleteById, create, login, updateById} from '../services/users.service.js'
import prisma from "../db.js";

/**
 * Get all users
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getUsers = async (req, res) => {
    const data = await getAll(req.query.sortBy, req.query.sortDir)
    res.json({
        success: true,
        data
    })
}

/**
 * Get user by id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getUserById = async (req, res) => {
    const user = await getById(parseInt(req.params.id))

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    return res.json({
        success: true,
        data: user
    })
}

/**
 * Delete user by id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const deleteUserById = async (req, res) => {
    try {
        const userId = req.user?.id;

        await prisma.visit.deleteMany({
            where: {
                user_id: userId
            }
        });

        await prisma.couple.deleteMany({
            where: {
                OR: [
                    { user1_id: userId },
                    { user2_id: userId }
                ]
            }
        });

        const hasBeenDeleted = await deleteById(userId);
        if (!hasBeenDeleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.json({
            success: true,
            message: 'User and related records deleted'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting user',
            error: err.message
        });
    }
}

/**
 * Update user by id
 * @param {Request} req
 * @param {Response} res
 */
export const updateUserById = async (req, res) => {
    const user = await updateById(parseInt(req.params.id), req.body)
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }

    return res.json({
        success: true,
        data: user
    })
}

/**
 * Register user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const registerUser = async (req, res, next) => {
    let {username, password, isAdmin, preferred_temperature, favorite_continent} = req.body
    let user

    try {
        user = await create(username, password, isAdmin, preferred_temperature, favorite_continent)
    } catch (err) {
        return next(err)
    }

    res.json({
        success: true,
        data: user
    })
}

/**
 * Login user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const loginUser = async (req, res, next) => {
    const { username, password } = req.body
    let token

    try {
        token = await login(username, password)
    } catch (err) {
        if (err.message === 'Invalid password') {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            })
        }
        return next(err)
    }

    res.json({
        success: true,
        message: 'Login successful',
        token: token
    })
}

/**
 * Logout user
 * @param {Request} req
 * @param {Response} res
 */
export const logoutUser = async (req, res) => {
    res.clearCookie("token")
    res.json({
        success: true,
        message: 'Logout successful',
    })

}