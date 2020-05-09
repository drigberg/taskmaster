/**
 * Module dependencies
 */

const axios = require('axios');
const router = require('express').Router();
const queryString = require('query-string');

const {setRefreshTokenCookie} = require('../auth');
const {logger} = require('../logger');
const {logResponse} = require('../requestLogger');

/**
 * Module
 */

const TOKEN_URL = `https://${process.env.AUTH_DOMAIN}/oauth2/token`;


function getAuthorizationTokenFromRequest(req) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        logger.error('No auth header provided');
        return null;
    }

    const authorizationHeaderParts = authorizationHeader.split('Bearer ');
    if (authorizationHeaderParts.length !== 2) {
        logger.error('Malformed auth header');
        return null;
    }

    const authorizationCode = authorizationHeaderParts[1];
    return authorizationCode;
}

async function handleGetToken(req, res, next) {
    function throwError(code) {
        const error = new Error('Invalid token');
        logger.error(error);
        error.httpStatusCode = code;
        next(error);
    }

    const refreshToken = req.cookies.refreshToken;
    let body;
    if (refreshToken && refreshToken !== 'undefined') {
        logger.debug('Have refresh token: authenticating');
        body = queryString.stringify({
            grant_type: 'refresh_token',
            client_id: process.env.APP_CLIENT_ID,
            redirect_uri: process.env.CALLBACK_URL,
            refresh_token: refreshToken,
        });
    } else {
        // if refresh token, check for authorization code in headers
        const authorizationCode = getAuthorizationTokenFromRequest(req);
        if (!authorizationCode) {
            // No authorization code or refresh token: error
            logger.error('No valid authorization code or refresh token provided');
            throwError(400);
            return;
        }

        body = queryString.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.APP_CLIENT_ID,
            redirect_uri: process.env.CALLBACK_URL,
            code: authorizationCode,
        });
    }

    // get tokens from AWS
    const options = {
        headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: process.env.APP_CLIENT_ID,
            password: process.env.APP_CLIENT_SECRET
        }
    };

    let tokenData;
    try {
        const response = await axios.post(TOKEN_URL, body, options);
        tokenData = response.data;
    } catch (err) {
        logger.error(`Unable to get token: ${err}`);
        throwError(401);
        return;
    }
    

    if (tokenData.expires_in <= 0) {
        logger.error('Token has expired');
        throwError(401);
        return;
    }

    logResponse(req.ctx.requestId, 200, req);
    if (tokenData.refresh_token) {
        setRefreshTokenCookie(res, tokenData.refresh_token);
    }
    res.json({ 
        idToken: tokenData.id_token,
        accessToken: tokenData.access_token
    });
}

function handleLogout(req, res, next) {
    res.clearCookie('refreshToken');
    next();
}

router.get('/logout', handleLogout);
router.get('/getToken', handleGetToken);

/**
 * Module exports
 */

module.exports = router;
