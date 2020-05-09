/**
 * Module dependencies
 */

const router = require('express').Router();

const {logger} = require('../logger');
const {logResponse} = require('../requestLogger');

/**
 * Module
 */

/**
 * Get user data
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
function handleGetUserData(req, res, next) {
    try {
        const userData = req.ctx.userData;
        logResponse(req.ctx.requestId, 200, req);
        res.json({
            id: userData.id,
            name: userData.name,
        });
    } catch (error) {
        logger.error(`Error getting user data: ${error}`);
        error.requestId = req.ctx.requestId;
        next(error);
    }
}

router.get('/whoami', handleGetUserData);

/**
 * Module exports
 */

module.exports = router;