
/**
 * Module dependencies
 */

const uuid = require('uuid');

const {logger} = require('./logger');


/**
 * Module
 */

/**
 * Logs request and creates request id
 * @param {Request} req - Express request object 
 * @return {String} request id
 */
function logRequest(req) {
    const requestId = uuid.v4();
    logger.info(`Request received [requestId=${requestId}  path=${req.path} method=${req.method}]`);
    return requestId;
}

/**
 * Logs request and creates request id
 * @param {String} requestId - request id
 * @param {Number} statusCode - response status code
 * @param {Request} req - Express request object 
 */
function logResponse(requestId, statusCode, req) {
    logger.info(`Sending response [requestId=${requestId}  path=${req.path} method=${req.method} status=${statusCode}]`);
}


/**
 * Module exports
 */

module.exports = {
    logRequest,
    logResponse
};
