import jwt from 'jsonwebtoken'

/**
 * Middleware to check if the user is authenticated
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export default (req, res, next) => {
    let token = req.headers?.authorization

    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    token = token.replace('Bearer ', '')

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
    } catch {
        return res.status(401).json({ message: 'Invalid token' })
    }

    next()
}

/**
 * Middleware to check if the user is an admin
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized' })
    }

    next()
}