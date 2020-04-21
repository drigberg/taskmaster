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
    }

    _populate() {
        const taskIds = [
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),]

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
                        new Date('2020-04-02'),
                        new Date('2020-04-05'),
                        new Date('2020-04-10'),
                    ],
                    archived: false
                },
                [taskIds[1]]: {
                    id: taskIds[1],
                    name: 'clean C3PO',
                    frequency: 7,
                    completionDates: [
                        new Date('2020-04-02'),
                    ],
                    archived: false
                },
                [taskIds[2]]: {
                    id: taskIds[2],
                    name: 'scrub the Falcon',
                    frequency: 31,
                    completionDates: [
                        new Date('2020-03-07'),
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