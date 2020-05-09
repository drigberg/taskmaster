/**
 * Module dependencies
 */

const {validateAndParseToken} = require('../auth');
const {logRequest} = require('../requestLogger');

/**
 * Module
 */


/**
 * Sets request context and logs request
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express callback function
 */
function initRequest(req, res, next) {
    const requestId = logRequest(req);
    req.ctx = {
        requestId,
    };
    next();
}


/**
 * Validates token
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express callback function
 */
async function authenticate(req, res, next) {
    function throwError400() {
        const error = new Error('Invalid token');
        error.httpStatusCode = 400;
        next(error);
    }

    // get token from headers
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        throwError400();
        return;
    }

    const authorizationHeaderParts = authorizationHeader.split('Bearer ');
    if (authorizationHeaderParts.length !== 2) {
        throwError400();
        return;
    }

    const accessToken = authorizationHeaderParts[1];
    let userData;

    // validate token
    try {
        userData = await validateAndParseToken(accessToken);
    } catch {
        throwError400();
        return;
    }

    // pass along user data
    req.ctx.userData = {
        id: userData['cognito:username'],
        name: userData.nickname,
    };
    next();
}


/**
 * Module exports
 */

module.exports = {
    authenticate,
    initRequest,
};
