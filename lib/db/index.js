/**
 * Module dependencies
 */

const uuid = require('uuid');
const dynamodb = require('./dynamodb_client');
const {queueAsyncFunctions} = require('../util');
const {logger, LEVELS} = require('../logger');


/**
 * Module
 */

logger.setLogLevel(LEVELS.DEBUG);

class DB {
    constructor() {
        logger.info('Db initialized');
    }

    /**
     * Fetches user data
     * @param {String} userId - user id
     */
    async getUserById(userId) {
        const response = await dynamodb.getItem({
            TableName: 'Users',
            Key: {
                id: {
                    S: userId
                }
            }
        }).promise();
        console.log(response);
        // TODO: handle errors
        // TODO: parse response, return document as serialized class
        return response;
    }


    /**
     * Fetches all tasks in scope
     */
    async listTasks() {
        const response = await dynamodb.query({
            TableName: 'Tasks',
            Select: 'ALL_ATTRIBUTES',
        }).promise();
        // TODO: handle errors
        // TODO: parse response, return documents as serialized classes
        return response;
    }

    /**
     * Fetches task data
     * @param {String} taskId - task id
     */
    async getTaskById(taskId) {
        const response = await dynamodb.getItem({
            TableName: 'Tasks',
            Key: {
                id: {
                    S: taskId
                }
            }
        }).promise();
        // TODO: handle errors
        // TODO: parse response, return document as serialized class
        return response;
    }
    

    async createTask(data) {
        // TODO: validate data.userId in authorization
        await this.getUserById(data.userId);
        const taskId = uuid.v4();
        const payload = {
            id: taskId,
            userId: data.userId,
            name: data.name,
            frequency: data.frequency,
            completionDates: [],
            archived: false
        };
        const response = await dynamodb.put(payload).promise();
        // TODO: handle errors
        // TODO: parse response, return document as serialized class
        return response;
    }

    putTask(taskId, data) {
        return dynamodb.put({
            id: taskId,
            ...data
        }).promise();
        // TODO: handle errors
    }

    async putTasksBulk(updatesByTaskId) {
        const that = this;
        const updates = Object.entries(updatesByTaskId).map(([taskId, payload]) => ({ taskId, payload }));
        const fns = updates.map(update => that.putTask.bind(update.taskId, update.payload));
        await queueAsyncFunctions(fns, 10);
        // TODO: handle errors
    }

    async addTaskCompletion(taskId, completionDate) {
        // NOTE: we accept a completion date as an argument because
        // we don't want the date to be affected by the server timezone --
        // if it's 2020-04-20 in the user's timezone, it should be logged
        // as such. This approach could be messy if the user often takes international
        // flights going west near midnight, but it's close enough for the purposes of this app.

        // TODO: enforce chronological order
        // TODO: validate data.userId in authorization
        const task = await this.getTaskById(taskId);

        if (!task.completionDates.includes(completionDate)) {
            task.completionDates.push(completionDate);
        }

        await this.putTask(taskId, task);
        // TODO: handle errors
        // TODO: parse response, return document as serialized class
    }
}


/**
 * Module exports
 */


module.exports = new DB();