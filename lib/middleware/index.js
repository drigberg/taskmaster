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
    function throwError401() {
        const error = new Error('Invalid token');
        error.httpStatusCode = 401;
        next(error);
    }

    // get token from headers
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        throwError401();
        return;
    }

    const authorizationHeaderParts = authorizationHeader.split('Bearer ');
    if (authorizationHeaderParts.length !== 2) {
        throwError401();
        return;
    }

    const accessToken = authorizationHeaderParts[1];
    let userData;

    // validate token
    try {
        // TODO: find a nicer way to allow authentication in tests
        if (process.env.ENV === 'TEST' && accessToken === 'TEST_TOKEN') {
            userData = {
                'cognito:username': 'lukeskywalker',
                nickname: 'Luke'
            };
        } else {
            userData = await validateAndParseToken(accessToken);
        }
    } catch {
        throwError401();
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
