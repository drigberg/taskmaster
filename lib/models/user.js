/**
 * Module dependencies
 */

const uuid = require('uuid');
const schemas = require('../db/schemas');

/**
 * Module
 */

class UserData {
    constructor(id, name, created) {
        this.id = id;
        this.name = name;
        this.created = created;
    }

    static create(name) {
        const nowISO = new Date().toISOString();
        return new UserData(uuid.v4(), name, nowISO);
    }

    static fromJSON(data) {
        return new UserData(data.id, data.name, data.created);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            created: this.created,
        };
    }
}

class User {
    static async create(data) {
        // TODO: validate userId in authorization
        const userData = UserData.create(data.name);
        await schemas.users.create(userData.toJSON());
        // TODO: handle errors
        return userData;
    }

    /**
     * Fetches user data
     * @param {String} userId - user id
     */
    static async getById(userId) {
        const data = await schemas.users.getById(userId);
        return UserData.fromJSON(data);
    }

    static async removeAll() {
        if (process.env.TESTING !== 'TRUE') {
            throw new Error('Can only remove all users in testing!');
        }

        await schemas.users.removeAll();

        // TODO: handle errors 
    }
}

/**
 * Module exports
 */

module.exports = {
    User,
    UserData
};
