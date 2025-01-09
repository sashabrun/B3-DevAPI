import prisma from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
