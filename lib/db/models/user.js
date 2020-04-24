/**
 * Module dependencies
 */

const uuid = require('uuid');
const dynamodb = require('../dynamodb_client');

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

    static fromDynamoDb(data) {
        const expectedKeys = ['id', 'name', 'created'];
        expectedKeys.forEach((key) => {
            if (!Object.keys(data).includes(key)) {
                throw new Error(`Missing key for user: ${key}`);
            }
        });

        if (Object.keys(data).length != expectedKeys.length) {
            throw new Error(`Expected user data to have keys ${expectedKeys}, got ${Object.keys(data)}`);
        }

        return new UserData(data.id.S, data.name.S, data.created.S);
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
    /**
     * Fetches user data
     * @param {String} userId - user id
     */
    static async getById(userId) {
        const response = await dynamodb.getItem({
            TableName: 'Users',
            Key: {
                id: {
                    S: userId
                }
            }
        }).promise();
        const user = UserData.fromDynamoDb(response.Item);
        // TODO: handle errors
        // TODO: parse response, return document as serialized class
        return user;
    }

}

/**
 * Module exports
 */

module.exports = {
    User,
    UserData
};
