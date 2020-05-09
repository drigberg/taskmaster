/**
 * Module dependencies
 */

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

const routes = require('./routes');
const {logger} = require('./logger');
const {logResponse} = require('./requestLogger');
const {authenticate, initRequest} = require('./middleware');
/**
 * Module
 */

const BUILD_DIR = path.join(__dirname, '..', 'build');

const CORS_CONFIG = process.env.ENV === 'PROD' ? {
    origin: `https://${process.env.DOMAIN}`,
    credentials: true
} : {
    origin: 'http://localhost:3000',
    credentials: true
};

function errorHandler (err, req, res, next) {
    logger.error(`Caught in error handler: ${err}`);
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.httpStatusCode || 500;
    logResponse(err.requestId, statusCode, req);
    res.status(statusCode);
    res.json({ error: err });
}

/**
 * Creates application
 * @return {Object} - express application
 */
function createApp() {
    const app = express();
    app.use(cors(CORS_CONFIG));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(express.static(BUILD_DIR));

    // API routes
    app.use('/api/auth', initRequest, routes.auth);
    app.use('/api/users', initRequest, authenticate, routes.users);
    app.use('/api/tasks', initRequest, authenticate, routes.tasks);
    app.use(errorHandler);

    // serve React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(BUILD_DIR, 'index.html'));
    });

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
