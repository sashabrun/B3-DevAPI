
import {getAll, getById, deleteById, create, login, updateById} from '../services/users.service.js'
import prisma from "../db.js";

/**
 * Async handler for routes
 * @param {Function} fn
 * @returns {Function}
 */
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Get all users
 */
export const getUsers = asyncHandler(async (req, res) => {
    const data = await getAll(req.query.sortBy, req.query.sortDir);
    res.json({ success: true, data });
});

/**
 *  Get user by id
 */
export const getUserById = asyncHandler(async (req, res) => {
    const user = await getById(parseInt(req.params.id));

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
});

/**
 * Delete user by id
 */
export const deleteUserById = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    await prisma.visit.deleteMany({
        where: { user_id: userId },
    });

    await prisma.couple.deleteMany({
        where: {
            OR: [{ user1_id: userId }, { user2_id: userId }],
        },
    });

    const hasBeenDeleted = await deleteById(userId);
    if (!hasBeenDeleted) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User and related records deleted' });
});

/**
 * Update user by id
 */
export const updateUserById = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { username } = req.body;

    if (username) {
        const existingUser = await prisma.user.findFirst({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }
    }

    const user = await updateById(parseInt(userId), req.body);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user, message: 'User updated' });
});
/**
 * Register user
 */
export const registerUser = asyncHandler(async (req, res) => {
    const { username, password, isAdmin, preferred_temperature, favorite_continent } = req.body;

    const user = await create(username, password, isAdmin, preferred_temperature, favorite_continent);
    res.json({ success: true, data: user });
});

/**
 * Login user
 */
export const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const token = await login(username, password);
    res.json({ success: true, message: 'Login successful', token });
});
/**
 * Logout user
 */
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: 'Logout successful' });
});
