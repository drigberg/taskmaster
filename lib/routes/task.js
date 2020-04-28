/**
 * Module dependencies
 */

const models = require('../models');
const {logger} = require('../logger');

const {logRequest, logResponse} = require('../requestLogger');

/**
 * Module
 */

async function handleListTasks(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    // TODO: use id of logged-in user, disallow in body
    const requestId = logRequest(req);
    const userId = 'lukeskywalker'; // TODO: get userId from auth
    try {
        const tasks = await models.task.Task.list(userId);
        const responseData = tasks.map(task => task.toJSON());
        logResponse(requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error listing tasks: ${error}`);
        error.requestId = requestId;
        next(error);
    }
}

async function handleGetTask(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    // TODO: use id of logged-in user, disallow in body
    const requestId = logRequest(req);
    const taskId = req.params.id;
    try {
        const task = await models.task.Task.getById(taskId);
        const responseData = task.toJSON();
        logResponse(requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error getting task by id: ${error}`);
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
async function handleCreateTask(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    // TODO: use id of logged-in user
    const requestId = logRequest(req);
    const userId = 'lukeskywalker';
    try {
        const task = await models.task.Task.create(userId, req.body);
        const responseData = task.toJSON();
        logResponse(requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error creating task: ${error}`);
        error.requestId = requestId;
        next(error);
    }
}

/**
 * Updates task
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
async function handleUpdateTask(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    // TODO: assert that task exists
    const requestId = logRequest(req);
    const taskId = req.params.id;
    const userId = 'lukeskywalker';
    try {
        const task = await models.task.Task.update(userId, taskId, req.body);
        const responseData = task.toJSON();
        logResponse(requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error updating task: ${error}`);
        error.requestId = requestId;
        next(error);
    }
}

/**
 * Updates many tasks
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - callback
 */
async function handleUpdateTasksBulk(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    // TODO: assert that tasks exist
    // TODO: get user id from auth
    const requestId = logRequest(req);
    const userId = 'lukeskywalker';
    try {
        await models.task.Task.updateMany(userId, req.body);
        logResponse(requestId, 200, req);
        res.json({ ok: 'ok' });
    } catch (error) {
        logger.error(`Error updating tasks bulk: ${error}`);
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
async function handleAddCompletionDate(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    // TODO: validate that task exists
    const requestId = logRequest(req);
    const taskId = req.params.id;
    // TODO: get userId from auth
    const userId = 'lukeskywalker';
    try {
        const task = await models.task.Task.addCompletionDate(userId, taskId, req.body.completionDate);
        const responseData = task.toJSON();
        logResponse(requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error adding task completion: ${error}`);
        error.requestId = requestId;
        next(error);
    }
}

/**
 * Module exports
 */

module.exports = {
    handleListTasks,
    handleGetTask,
    handleCreateTask,
    handleUpdateTask,
    handleUpdateTasksBulk,
    handleAddCompletionDate,
};
