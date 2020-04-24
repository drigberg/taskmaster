/**
 * Module dependencies
 */

const {Task} = require('../db/models/task');
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
        const tasks = await Task.list(userId);
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
        const task = await Task.getById(taskId);
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
    // TODO: use id of logged-in user, disallow in body
    const requestId = logRequest(req);
    try {
        const task = await Task.put(req.body);
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
    try {
        const task = await Task.put(taskId, req.body);
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
    const requestId = logRequest(req);
    try {
        await Task.putBulk(req.body);
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
async function handleTaskCompletion(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    // TODO: validate that task exists
    const requestId = logRequest(req);
    const taskId = req.params.id;
    try {
        const task = await Task.addCompletionDate(taskId, req.body.completionDate);
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
    handleTaskCompletion,
};
