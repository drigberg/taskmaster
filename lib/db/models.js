/**
 * Module dependencies
 */

const uuid = require('uuid');

/**
 * Module
 */

class User {
    constructor(id, name, created) {
        this.id = id;
        this.name = name;
        this.created = created;
        this.tasks = [];
    }

    static create(name) {
        const nowISO = new Date().toISOString();
        return new User(uuid.v4(), name, nowISO);
    }

    static fromJSON(data) {
        const expectedKeys = ['id', 'name', 'created'];
        expectedKeys.forEach((key) => {
            if (!Object.keys(data).includes(key)) {
                throw new Error(`Missing key for user: ${key}`);
            }
        });

        if (Object.keys(data).length != 3) {
            throw new Error(`Expected user data to have keys ${expectedKeys}, got ${Object.keys(data)}`);
        }

        return User(data.id, data.name, data.created);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            created: this.created,
            tasks: this.tasks,
        };
    }
}

class Task {
    constructor(id, name, frequency) {
        this.id = id;
        this.name = name;
        this.frequency = frequency;
        this.completionDates = [];
        this.archived = false;
    }

    static create(name, frequency) {
        return new Task(uuid.v4(), name, frequency);
    }

    static fromJSON(data) {
        const expectedKeys = ['id', 'name', 'frequency', 'completionDates', 'archived'];
        expectedKeys.forEach((key) => {
            if (!Object.keys(data).includes(key)) {
                throw new Error(`Missing key for user: ${key}`);
            }
        });

        if (Object.keys(data).length != 3) {
            throw new Error(`Expected user data to have keys ${expectedKeys}, got ${Object.keys(data)}`);
        }

        return new Task(data.id, data.name, data.frequency);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            frequency: this.frequency,
            completionDates: this.completionDates,
            archived: this.archived,
        };
    }
}


/**
 * Module exports
 */

module.exports = {
    Task,
    User,
};
