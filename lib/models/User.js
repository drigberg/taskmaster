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

    /**
     * Creates User from data
     * @param {Object} data - user data
     * @return {User}
     */
    static fromJSON(data) {
        return new User(data.id, data.name, data.created);
    }

    /**
     * Returns User as JSON-serializable object
     * @return {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            created: this.created,
        };
    }

    /**
     * Creates new user
     * @param {Object} data - user data 
     * @return {User}
     */
    static async create(data) {
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

    /**
     * Clears all users out of db
     * NOTE: can only be used in testing mode
     */
    static async removeAll() {
        if (process.env.ENV !== 'TEST') {
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
