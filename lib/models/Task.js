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

    /**
     * Creates Task from data
     * @param {Object} data - task data
     * @return {Task}
     */
    static fromJSON(data) {
        return new Task(
            data.id,
            data.userId,
            data.name,
            data.frequency,
            data.completionDates,
            data.archived);
    }

    /**
     * Converts task data to JSON-serializable object
     * @return {Object}
     */
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
     * Fetches all tasks for user
     * @return {Array<Task>}
     */
    static async list(userId) {
        const items = await schemas.tasks.listTasksForUser(userId);
        return items.map(item => Task.fromJSON(item));
    }

    /**
     * Fetches task data
     * @param {String} userId - user id
     * @param {String} taskId - task id
     * @return {Task}
     */
    static async getById(userId, taskId) {
        const item = await schemas.tasks.getTaskById(userId, taskId);
        return Task.fromJSON(item);
    }
    
    /**
     * Creates new tasks for user
     * @param {String} userId - user id
     * @param {Object} data - data for task
     * @return {Task}
     */
    static async create(userId, data) {
        // TODO: validate userId in authorization
        const task = new Task(null, userId, data.name, data.frequency);
        await schemas.tasks.put(task.toJSON());
        // TODO: handle errors
        return task;
    }

    /**
     * Updates existing task
     * @param {String} userId - user id
     * @param {String} taskId - task id
     * @param {Object} data - update data
     * @return {Task}
     */
    static async update(userId, taskId, data) {
        // TODO: validate userId in authorization
        await schemas.tasks.update(userId, taskId, data);
        // TODO: handle errors
        const task = await this.getById(userId, taskId);
        return task;
    }

    /**
     * Updates many tasks
     * @param {String} userId - user id
     * @param {Object} updatesByTaskId - update data stored by task id
     */
    static async updateMany(userId, updatesByTaskId) {
        const that = this;
        const fns = Object.entries(updatesByTaskId)
            .map(([taskId, data]) => that.update.bind(that, userId, taskId, data));
        await queueAsyncFunctions(fns, 10);
        // TODO: handle errors
    }

    /**
     * Adds new date to completion date list for task
     * @param {String} userId - user id
     * @param {String} taskId - task id
     * @param {String} completionDate - date string
     * @return {Task}
     */
    static async addCompletionDate(userId, taskId, completionDate) {
        // NOTE: we accept a completion date as an argument because
        // we don't want the date to be affected by the server timezone --
        // if it's 2020-04-20 in the user's timezone, it should be logged
        // as such. This approach could be messy if the user often takes international
        // flights going west near midnight, but it's close enough for the purposes of this app.

        // TODO: enforce chronological order
        // TODO: validate data.userId in authorization
        let task = await this.getById(userId, taskId);
        if (!task.completionDates.includes(completionDate)) {
            task.completionDates.push(completionDate);
            task = await this.update(userId, taskId, { completionDates: task.completionDates });
        }

        // TODO: handle errors
        return task;
    }

    /**
     * Clears all tasks out of db
     * NOTE: can only be used in testing mode
     */
    static async removeAll() {
        if (process.env.ENV !== 'TEST') {
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
