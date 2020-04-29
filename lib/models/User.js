/**
 * Module dependencies
 */

const uuid = require('uuid');
const schemas = require('../db/schemas');

/**
 * Module
 */

class User {
    constructor(id, name, created) {
        this.id = id || uuid.v4();
        this.name = name;
        this.created = created || new Date().toISOString();
    }

    static fromJSON(data) {
        return new User(data.id, data.name, data.created);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            created: this.created,
        };
    }

    static async create(data) {
        // TODO: validate userId in authorization
        const user = new User(null, data.name, null);
        await schemas.users.create(user.toJSON());
        // TODO: handle errors
        return user;
    }

    /**
     * Fetches user data
     * @param {String} userId - user id
     */
    static async getById(userId) {
        const data = await schemas.users.getById(userId);
        return User.fromJSON(data);
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

module.exports = User;
