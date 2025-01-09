import prisma from '../db.js'

/**
 * Get all couples
 * @param sortBy
 * @param sortDirection
 * @returns {PrismaPromise<GetFindResult<Prisma.$CouplePayload<DefaultArgs>, {select: {user1_id: boolean, id: boolean, user2_id: boolean}}, {}>[]>}
 */
export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            id: true,
            user1_id: true,
            user2_id: true,
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return prisma.couple.findMany(options);
}

/**
 * Get a couple by ID
 * @param id
 * @returns {Promise<Prisma.Prisma__CoupleClient<GetResult<Prisma.$CouplePayload<DefaultArgs>, {select: {user1_id: boolean, id: boolean, user2_id: boolean}, where: {id}}, "findUnique"> | null, null, DefaultArgs>>}
 */
export const getById = async (id) => {
    return prisma.couple.findUnique({
        select: {
            id: true,
            user1_id: true,
            user2_id: true,
        },
        where: {
            id
        }
    });
}

/**
 * Delete a couple
 * @param id
 * @returns {Promise<boolean>}
 */
export const deleteById = async (id) => {
    if (await getById(id)) {
        await prisma.couple.delete({
            where: {
                id
            }
        })
        return true
    }
    return false
}

/**
 * Create a couple
 * @param user1_id
 * @param user2_id
 * @returns {Promise<Prisma.Prisma__CoupleClient<GetResult<Prisma.$CouplePayload<DefaultArgs>, {select: {user1_id: boolean, id: boolean, user2_id: boolean}, where: {id}}, "create">>}
 */
export const create = async (user1_id, user2_id) => {
    const user1Exists = await prisma.user.findUnique({
        where: { id: user1_id }
    });

    const user2Exists = await prisma.user.findUnique({
        where: { id: user2_id }
    });

    if (!user1Exists) {
            throw new Error(`First user does not exist`);
    }

    if (!user2Exists) {
        throw new Error(`Second user does not exist`);
    }
    const couple = await prisma.couple.create({
        data: {
            user1_id,
            user2_id
        },
        select: {
            id: true,
            user1_id: true,
            user2_id: true,
        }
    })

    return couple
}