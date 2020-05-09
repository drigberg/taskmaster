/**
 * Module dependencies
 */

const router = require('express').Router();

const models = require('../models');
const {logger} = require('../logger');
const {logResponse} = require('../requestLogger');

/**
 * Module
 */

async function handleListTasks(req, res, next) {
    const {id: userId} = req.ctx.userData;
    try {
        const tasks = await models.Task.list(userId);
        const responseData = tasks.map(task => task.toJSON());
        logResponse(req.ctx.requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error listing tasks: ${error}`);
        error.requestId = req.ctx.requestId;
        next(error);
    }
}

async function handleGetTask(req, res, next) {
    const taskId = req.params.id;
    const {id: userId} = req.ctx.userData;
    try {
        const task = await models.Task.getById(userId, taskId);
        const responseData = task.toJSON();
        logResponse(req.ctx.requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error getting task by id: ${error}`);
        error.requestId = req.ctx.requestId;
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
    // TODO: validate payload
    const {id: userId} = req.ctx.userData;
    try {
        const task = await models.Task.create(userId, req.body);
        const responseData = task.toJSON();
        logResponse(req.ctx.requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error creating task: ${error}`);
        error.requestId = req.ctx.requestId;
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
    // TODO: validate payload
    const taskId = req.params.id;
    const {id: userId} = req.ctx.userData;
    try {
        const task = await models.Task.update(userId, taskId, req.body);
        const responseData = task.toJSON();
        logResponse(req.ctx.requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error updating task: ${error}`);
        error.requestId = req.ctx.requestId;
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
    // TODO: validate payload
    // TODO: assert that tasks exist
    const {id: userId} = req.ctx.userData;
    try {
        await models.Task.updateMany(userId, req.body);
        logResponse(req.ctx.requestId, 200, req);
        res.json({ ok: 'ok' });
    } catch (error) {
        logger.error(`Error updating tasks bulk: ${error}`);
        error.requestId = req.ctx.requestId;
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
    // TODO: validate payload
    const taskId = req.params.id;
    const {id: userId} = req.ctx.userData;
    try {
        const task = await models.Task.addCompletionDate(userId, taskId, req.body.completionDate);
        const responseData = task.toJSON();
        logResponse(req.ctx.requestId, 200, req);
        res.json(responseData);
    } catch (error) {
        logger.error(`Error adding task completion: ${error}`);
        error.requestId = req.ctx.requestId;
        next(error);
    }
}

router.get('/', handleListTasks);
router.get('/:id', handleGetTask);
router.post('/', handleCreateTask);
router.post('/updateBulk', handleUpdateTasksBulk);
router.post('/:id', handleUpdateTask);
router.post('/:id/addCompletionDate', handleAddCompletionDate);

/**
 * Module exports
 */

module.exports = router;
