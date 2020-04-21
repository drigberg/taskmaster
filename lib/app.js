/**
 * Module dependencies
 */

const bodyParser = require('body-parser');
const express = require('express');
const uuid = require('uuid');

const {logger} = require('./logger');
const store = require('./store');

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
 * Lists tasks for user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
function handleGetUserData(req, res, next) {
    // TODO: protect route with authentication and authorization
    const requestId = logRequest(req);
    const userId = req.params.id;
    try {
        const userData = store.getUserById(userId);
        logResponse(requestId, 200, req);
        res.json(userData);
    } catch (error) {
        error.requestId = requestId;
        next(error);
    }
}

/**
 * Creates a new task
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
function handleCreateTask(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    const requestId = logRequest(req);
    const userId = req.params.id;
    try {
        store.createTaskForUser(userId, req.body);
        const userData = store.getUserById(userId);
        logResponse(requestId, 200, req);
        res.json(userData);
    } catch (error) {
        error.requestId = requestId;
        next(error);
    }
}

/**
 * Updates tasks
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
function handleUpdateTasks(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    const requestId = logRequest(req);
    const userId = req.params.id;
    try {
        store.updateUserTasks(userId, req.body);
        const userData = store.getUserById(userId);
        logResponse(requestId, 200, req);
        res.json(userData);
    } catch (error) {
        error.requestId = requestId;
        next(error);
    }
}

/**
 * Add completion datetime to task
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
function handleTaskCompletion(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    const requestId = logRequest(req);
    const userId = req.params.id;
    try {
        store.addTaskCompletion(userId, req.body.taskId, req.body.completionDate);
        const userData = store.getUserById(userId);
        logResponse(requestId, 200, req);
        res.json(userData);
    } catch (error) {
        error.requestId = requestId;
        next(error);
    }
}


function errorHandler (err, req, res, next) {
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
    app.use(bodyParser.json());
    app.get('/api/users/:id', handleGetUserData);
    app.post('/api/users/:id/updateTasks', handleUpdateTasks);
    app.post('/api/users/:id/createTask', handleCreateTask);
    app.post('/api/users/:id/addTaskCompletion', handleTaskCompletion);
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
