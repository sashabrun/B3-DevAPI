import prisma from '../db.js'

export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            name: true,
            continent: true,
            temperature: true,
            is_open: true,
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return prisma.country.findMany(options);
}

export const getById = async (id) => {
    return prisma.country.findUnique({
        select: {
            id: true,
            name: true,
            continent: true,
            temperature: true,
            is_open: true,
        },
        where: {
            id
        }
    });
}

export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.country.delete({
            where: {
                id
            }
        })
        return true
    }
    return false
}

export const updateById = async (id, data) => {
    const country = await prisma.country.update({
        where: {
            id
        },
        data: {
            name: data.name,
            continent: data.continent,
            temperature: data.temperature,
            is_open: data.is_open
        },
        select: {
            id: true,
            name: true,
            continent: true,
            temperature: true,
            is_open: true,
        }
    })

    return country
}

export const create = async (name, continent, temperature, is_open) => {

    const count = await prisma.country.count({
        where: {
            name
        }
    })
    if (count > 0) throw new Error('Name already exists')

    const country = await prisma.country.create({
        data: {
            name,
            continent,
            temperature,
            is_open,
        },
        select: {
            id: true,
            name: true,
            continent: true,
            temperature: true,
            is_open: true,
        }
    })

    return country
}