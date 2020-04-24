/**
 * Module dependencies
 */

const db = require('../db');
const logger = require('../logger');

const {logRequest, logResponse} = require('../requestLogger');

/**
 * Module
 */

async function handleListTasks(req, res, next) {
    // TODO: protect route with authentication and authorization
    // TODO: validate payload
    // TODO: use id of logged-in user, disallow in body
    const requestId = logRequest(req);
    try {
        const tasks = await db.listTasks();
        logResponse(requestId, 200, req);
        res.json(tasks);
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
        const task = await db.getTaskById(taskId);
        logResponse(requestId, 200, req);
        res.json(task);
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
        const task = await db.createTask(req.body);
        logResponse(requestId, 200, req);
        res.json(task);
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
        const task = await db.putTask(taskId, req.body);
        logResponse(requestId, 200, req);
        res.json(task);
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
        await db.putTasksBulk(req.body);
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
        const task = await db.addTaskCompletion(taskId, req.body.completionDate);
        logResponse(requestId, 200, req);
        res.json(task);
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
