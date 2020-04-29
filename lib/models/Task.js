/**
 * Module dependencies
 */

const uuid = require('uuid');
const schemas = require('../db/schemas');
const {queueAsyncFunctions} = require('../util');

/**
 * Module
 */

class Task {
    constructor(id, userId, name, frequency, completionDates, archived) {
        this.id = id || uuid.v4();
        this.userId = userId;
        this.name = name;
        this.frequency = frequency;
        this.completionDates = completionDates || [];
        this.archived = archived || false;
    }

    static fromJSON(data) {
        return new Task(
            data.id,
            data.userId,
            data.name,
            data.frequency,
            data.completionDates,
            data.archived);
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

    /**
     * Fetches all tasks in scope
     */
    static async list(userId) {
        const items = await schemas.tasks.listTasksForUser(userId);
        return items.map(item => Task.fromJSON(item));
    }

    /**
     * Fetches task data
     * @param {String} userId - user id
     * @param {String} taskId - task id
     */
    static async getById(userId, taskId) {
        const item = await schemas.tasks.getTaskById(userId, taskId);
        return Task.fromJSON(item);
    }
    
    static async create(userId, data) {
        // TODO: validate userId in authorization
        const taskData = new Task(null, userId, data.name, data.frequency);
        await schemas.tasks.put(taskData.toJSON());
        // TODO: handle errors
        return taskData;
    }

    static async update(userId, taskId, data) {
        // TODO: validate userId in authorization
        await schemas.tasks.update(userId, taskId, data);
        // TODO: handle errors
        const taskData = await this.getById(userId, taskId);
        return taskData;
    }

    static async updateMany(userId, updatesByTaskId) {
        const that = this;
        const fns = Object.entries(updatesByTaskId)
            .map(([taskId, data]) => that.update.bind(that, userId, taskId, data));
        await queueAsyncFunctions(fns, 10);
        // TODO: handle errors
    }

    static async addCompletionDate(userId, taskId, completionDate) {
        // NOTE: we accept a completion date as an argument because
        // we don't want the date to be affected by the server timezone --
        // if it's 2020-04-20 in the user's timezone, it should be logged
        // as such. This approach could be messy if the user often takes international
        // flights going west near midnight, but it's close enough for the purposes of this app.

        // TODO: enforce chronological order
        // TODO: validate data.userId in authorization
        let taskData = await this.getById(userId, taskId);
        if (!taskData.completionDates.includes(completionDate)) {
            taskData.completionDates.push(completionDate);
            taskData = await this.update(userId, taskId, { completionDates: taskData.completionDates });
        }

        // TODO: handle errors
        return taskData;
    }

    static async removeAll() {
        if (process.env.TESTING !== 'TRUE') {
            throw new Error('Can only remove all tasks in testing!');
        }

        await schemas.tasks.removeAll();
        // TODO: handle errors 
    }
}


/**
 * Module exports
 */

module.exports = Task;
