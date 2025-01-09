import prisma from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Get all users
 */
export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            username: true,
            preferred_temperature: true,
            favorite_continent: true
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return prisma.user.findMany(options);
}

/**
 * Get user by id
 */
export const getById = async (id) => {
    return prisma.user.findUnique({
        select: {
            id: true,
            username: true,
            preferred_temperature: true,
            favorite_continent: true
        },
        where: {
            id
        }
    });
}

/**
 * Delete user by id
 */
export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.user.delete({
            where: {
                id
            }
        })
        return true
    }
    return false
}

/**
 * Update user by id
 */
export const updateById = async (id, data) => {
    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            username: data.username,
            preferred_temperature: data.preferred_temperature,
            favorite_continent: data.favorite_continent
        },
        select: {
            id: true,
            username: true,
            preferred_temperature: true,
            favorite_continent: true
        }
    })

    return user
}

/**
 * Register user
 * @param username
 * @param password
 * @param isAdmin
 * @param preferred_temperature
 * @param favorite_continent
 * @returns {Promise<Prisma.Prisma__UserClient<GetResult<Prisma.$UserPayload<DefaultArgs>, {select: {preferred_temperature: boolean, id: boolean, isAdmin: boolean, favorite_continent: boolean, username: boolean}, data: {password: *, preferred_temperature, isAdmin: boolean, favorite_continent, username}}, "create">, never, DefaultArgs>>}
 */
export const create = async (username, password, isAdmin = false, preferred_temperature, favorite_continent) => {

    const count = await prisma.user.count({
        where: {
            username
        }
    })
    if (count > 0) throw new Error('Username already exists')

    const encryptedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS))

    const user = await prisma.user.create({
        data: {
            username,
            password: encryptedPassword,
            isAdmin: isAdmin,
            preferred_temperature,
            favorite_continent
        },
        select: {
            id: true,
            username: true,
            isAdmin: true,
            preferred_temperature: true,
            favorite_continent: true
        }
    })

    return user
}

/**
 * Login user
 * @param username
 * @param password
 * @returns {Promise<*>}
 */
export const login = async (username, password) => {
    const user = await prisma.user.findFirst({
        where: {
            username
        }
    })

    if (!user) throw new Error('User not found')

    if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid password')

    const token = jwt.sign({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        preferred_temperature: user.preferred_temperature,
        favorite_continent: user.favorite_continent
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })

    return token
}
