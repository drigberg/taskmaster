/**
 * Module dependencies
 */

const uuid = require('uuid');

/**
 * Module
 */

class Store {
    constructor() {
        this._clear();
    }

    /**
     * Fetches user data
     * @param {String} userId - user userId
     */
    getUserById(userId) {
        if (!Object.keys(this.usersById).includes(userId)) {
            const error = new Error('User not found!');
            error.httpStatusCode = 404;
            throw error;
        }
        return this.usersById[userId];
    }

    createTaskForUser(userId, taskData) {
        const user = this.getUserById(userId);
        const taskId = uuid.v4();
        const newTask = {
            id: taskId,
            name: taskData.name,
            frequency: taskData.frequency,
            completionDates: [],
            archived: false
        };
        user.tasks[taskId] = newTask;
    }

    updateUserTasks(userId, updatesByTaskId) {
        const user = this.getUserById(userId);
        Object.entries(updatesByTaskId).forEach(([taskId, payload]) => {
            user.tasks[taskId] = {
                ...user.tasks[taskId],
                ...payload
            };
        });
    }

    addTaskCompletion(userId, taskId, completionDate) {
        // NOTE: we accept a completion date as an argument because
        // we don't want the date to be affected by the server timezone --
        // if it's 2020-04-20 in the user's timezone, it should be logged
        // as such. This approach could be messy if the user often takes international
        // flights going west near midnight, but it's close enough for the purposes of this app.

        // TODO: enforce chronological order
        const user = this.getUserById(userId);
        const task = user.tasks[taskId];
        if (!task) {
            const error = new Error(`No task with id ${taskId} found for user ${userId}`);
            error.httpStatusCode = 400;
            throw error;
        }

        if (!task.completionDates.includes(completionDate)) {
            task.completionDates.push(completionDate);
        }
    }

    _populate() {
        const taskIds = [
            uuid.v4(),
            uuid.v4(),
            uuid.v4()];

        this.usersById['lukeskywalker'] = {
            id: 'lukeskywalker',
            name: 'Luke Skywalker',
            created: new Date('2020-03-01'),
            tasks: {
                [taskIds[0]]: {
                    id: taskIds[0],
                    name: 'clean R2D2',
                    frequency: 7,
                    completionDates: [
                        '2020-04-02',
                        '2020-04-05',
                        '2020-04-10',
                    ],
                    archived: false
                },
                [taskIds[1]]: {
                    id: taskIds[1],
                    name: 'clean C3PO',
                    frequency: 7,
                    completionDates: [
                        '2020-04-02',
                    ],
                    archived: false
                },
                [taskIds[2]]: {
                    id: taskIds[2],
                    name: 'scrub the Falcon',
                    frequency: 31,
                    completionDates: [
                        '2020-03-07',
                    ],
                    archived: false
                },
            }
        };
    }

    /**
     * Clears store
     */
    _clear() {
        this.usersById = {};
    }
}


/**
 * Module exports
 */


module.exports = new Store();