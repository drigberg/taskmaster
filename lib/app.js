// load environment variables into process.env
require('dotenv').config();

/**
 * Module dependencies
 */

const bodyParser = require('body-parser');
const express = require('express');

const routes = require('./routes');
const {logger} = require('./logger');
const {logResponse} = require('./requestLogger');

/**
 * Module
 */


function errorHandler (err, req, res, next) {
    console.log(err)
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
    app.use(bodyParser.json());
    app.get('/api/users/:id', routes.user.handleGetUser);
    app.get('/api/tasks', routes.task.handleListTasks);
    app.get('/api/tasks/:id', routes.task.handleGetTask);
    app.post('/api/tasks', routes.task.handleCreateTask);
    app.post('/api/tasks/updateBulk', routes.task.handleUpdateTasksBulk);
    app.post('/api/tasks/:id', routes.task.handleUpdateTask);
    app.post('/api/tasks/:id/addCompletionDate', routes.task.handleAddCompletionDate);
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
