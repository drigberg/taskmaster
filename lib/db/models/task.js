/**
 * Module dependencies
 */

const uuid = require('uuid');
const dynamodb = require('../dynamodb_client');
const {queueAsyncFunctions} = require('../../util');

/**
 * Module
 */

class TaskData {
    constructor(id, userId, name, frequency, completionDates, archived) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.frequency = frequency;
        this.completionDates = completionDates;
        this.archived = archived;
    }

    static create(userId, name, frequency) {
        return new TaskData(uuid.v4(), userId, name, frequency, [], false);
    }

    static fromDynamoDb(data) {
        const expectedKeys = ['id', 'userId', 'name', 'frequency', 'completionDates', 'archived'];
        expectedKeys.forEach((key) => {
            if (!Object.keys(data).includes(key)) {
                throw new Error(`Missing key for task: ${key}`);
            }
        });

        if (Object.keys(data).length != expectedKeys.length) {
            throw new Error(`Expected task data to have keys ${expectedKeys}, got ${Object.keys(data)}`);
        }

        return new TaskData(
            data.id.S,
            data.userId.S,
            data.name.S,
            data.frequency.N,
            data.completionDates.L.map(item => item.S),
            data.archived.BOOL);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            name: this.name,
            frequency: this.frequency,
            completionDates: this.completionDates,
            archived: this.archived,
        };
    }
}

class Task {
    _put(taskId, data) {
        return dynamodb.putItem({
            id: taskId,
            ...data
        }).promise();
        // TODO: handle errors
    }

    /**
     * Fetches all tasks in scope
     */
    static async list(userId) {
        const response = await dynamodb.query({
            ExpressionAttributeValues: {
                ':v1': {
                    S: userId
                }
            }, 
            TableName: 'Tasks',
            Select: 'ALL_ATTRIBUTES',
            KeyConditionExpression: 'userId = :v1'
        }).promise();
        // TODO: handle errors
        console.log(response);
        return response.Items.map(item => TaskData.fromDynamoDb(item));
    }

    /**
     * Fetches task data
     * @param {String} taskId - task id
     */
    static async getById(taskId) {
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
    

    static async put(data) {
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

    static async putBulk(updatesByTaskId) {
        const that = this;
        const updates = Object.entries(updatesByTaskId).map(([taskId, payload]) => ({ taskId, payload }));
        const fns = updates.map(update => that.putTask.bind(update.taskId, update.payload));
        await queueAsyncFunctions(fns, 10);
        // TODO: handle errors
    }

    static async addCompletionDate(taskId, completionDate) {
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

module.exports = {
    Task,
    TaskData,
};
