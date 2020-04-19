/**
 * Module dependencies
 */

const bodyParser = require('body-parser');
const express = require('express');

const {logger} = require('./logger');
const store = require('./store');

/**
 * Module
 */

/**
 * Lists tasks for user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
function handleGetUserData(req, res, next) {
    logger.info('Request received: handleGetUserData');
    const userId = req.params.id;
    // TODO: protect route with authentication and authorization
    try {
        const userData = store.getUserById(userId);
        res.json(userData);
    } catch (error) {
        next(error);
    }
}


function errorHandler (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.httpStatusCode || 500);
    res.json({ error: err });
}

/**
 * Creates application
 * @return {Object} - express application
 */
function createApp() {
    const app = express();
    app.use(bodyParser.text());
    app.get('/api/users/:id', handleGetUserData);
    app.use(errorHandler);
    return app;
 }


/**
 * Starts server
 * @param {Object} app - application to start
 * @param {number} port - port for server to listen on
 * @return {Promise<Object>} - express server object
 */
function startServer(app, port) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(server);
            }
        });
    });
}

/**
 * Stops app
 * @param {Object} server - express server object
 * @return {Promise<null>}
 */
function stopServer(server) {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Module exports
 */

module.exports = {
    createApp,
    startServer,
    stopServer
};
