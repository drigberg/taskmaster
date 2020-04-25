/**
 * Module dependencies
 */

const {User} = require('../db/models/user');
const {logger} = require('../logger');

const {logRequest, logResponse} = require('../requestLogger');

/**
 * Module
 */

/**
 * Lists tasks for user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
async function handleGetUser(req, res, next) {
    // TODO: protect route with authentication and authorization
    const requestId = logRequest(req);
    const userId = req.params.id;
    try {
        const userData = await User.getById(userId);
        logResponse(requestId, 200, req);
        res.json(userData);
    } catch (error) {
        logger.error(`Error getting user: ${error}`);
        error.requestId = requestId;
        next(error);
    }
}

/**
 * Module exports
 */

module.exports = {
    handleGetUser
};